"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, GraduationCap, MapPin, Phone, Edit } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Scholar } from './UserFrame'
import { updateScholarInfo, getSchools, getBaranggays } from '@/components/Users/_actions/action'
import { School, Baranggay } from '@/components/types'
import { z } from 'zod'
import { useTheme } from 'next-themes'

const scholarSchema = z.object({
  id: z.number(),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  mobilenumber: z.string().min(1, "Mobile number is required"),
  yearLevel: z.string().min(1, "Year level is required"),
  school: z.object({
    id: z.number(),
    name: z.string(),
  }),
  barangay: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

type ScholarSchema = z.infer<typeof scholarSchema>

interface ScholarProfileDialogProps {
  scholar: Scholar | null
  open: boolean
  onClose: () => void
}

export function ScholarProfileDialog({ scholar, open, onClose }: ScholarProfileDialogProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false)
  const [editedScholar, setEditedScholar] = useState<ScholarSchema | null>(scholar)
  const [isLoading, setIsLoading] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [barangays, setBarangays] = useState<Baranggay[]>([])
  const [errors, setErrors] = useState<z.ZodIssue[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const schoolsData = await getSchools()
      const barangaysData = await getBaranggays()
      
      if (Array.isArray(schoolsData)) {
        setSchools(schoolsData)
      }
      
      if (Array.isArray(barangaysData)) {
        setBarangays(barangaysData)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setEditedScholar(scholar)
  }, [scholar])

  if (!scholar) return null

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editedScholar) return;

    const validationResult = scholarSchema.safeParse(editedScholar);

    if (!validationResult.success) {
      setErrors(validationResult.error.issues);
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateScholarInfo(editedScholar.id, editedScholar)
      if ('error' in result) {
        throw new Error(result.error)
      }
      setIsEditing(false)
      setErrors([]);
      toast({
        title: "Profile Updated",
        description: "Scholar profile has been successfully updated.",
      })
      router.refresh() // Refresh the page data
      onClose()
    } catch (error) {
      console.error('Error updating scholar:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update scholar profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false)
      setEditedScholar(scholar)
    } else {
      onClose()
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedScholar(prev => {
      if (!prev) return null;
      if (name === 'school') {
        const selectedSchool = schools.find(school => school.school_id.toString() === value);
        return {
          ...prev,
          school_id: selectedSchool?.school_id ?
            selectedSchool.school_id : prev.school
        };
      } else if (name === 'barangay') {
        const selectedBarangay = barangays.find(barangay => barangay.baranggay_id.toString() === value);
        return {
          ...prev,
          baranggay_id: selectedBarangay?.baranggay_id ? 
          selectedBarangay.baranggay_id : prev.barangay
        };
      }
      return prev;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedScholar(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    })
  }

  const getFieldErrors = (fieldName: string) => {
    return errors.filter(error => error.path[0] === fieldName).map(error => error.message);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        {!isEditing ? (
          // Profile View
          <div className="relative">
            {/* Header */}
            <div className="bg-[#191851] text-white p-4 h-40 relative">
              <button
                onClick={handleBack}
                className="absolute left-4 top-4 text-white hover:opacity-80"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-center">Profile</h2>
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Profile Image */}
              <div className="relative -mt-16 mb-4 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-600 bg-white">
                  <img
                    src="/logo.png"
                    alt={`${scholar.firstname} ${scholar.lastname}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Scholar Name */}
              <h3 className="text-xl font-bold text-center mb-8">
                {scholar.firstname} {scholar.lastname}
              </h3>

              {/* Scholar Details */}
              <div className="space-y-6 pl-7">
                <div className={`flex items-center gap-3 text-gray-600 ${theme === 'light' ? '' : 'text-white'}`}>
                  <GraduationCap className="h-5 w-5 text-ys" />
                  <span>Studied at <span className="font-medium">{scholar.school.name}</span></span>
                </div>
                <div className={`flex items-center gap-3 text-gray-600 ${theme === 'light' ? '' : 'text-white'}`}>
                  <MapPin className="h-5 w-5 text-ys" />
                  <span>Live in <span className="font-medium">{scholar.barangay.name}</span></span>
                </div>
                <div className={`flex items-center gap-3 text-gray-600 ${theme === 'light' ? '' : 'text-white'}`}>
                  <Phone className="h-5 w-5 text-ys" />
                  <span className="font-medium">{scholar.mobilenumber}</span>
                </div>
              </div>

              {/* Edit Button */}
              <Button 
                onClick={handleEdit} 
                className={`w-full mt-8 ${theme === 'light' ? '' : 'text-white'} bg-[#191851] hover:bg-[#191851]/90`}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        ) : (
          // Edit Form
          <div className="relative">
            {/* Header */}
            <div className="bg-[#191851] text-white p-4">
              <button
                onClick={handleBack}
                className="absolute left-4 top-4 text-white hover:opacity-80"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-center">Edit Profile</h2>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Name Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input 
                      id="firstname" 
                      name="firstname" 
                      value={editedScholar?.firstname} 
                      onChange={handleInputChange} 
                      className={getFieldErrors('firstname').length > 0 ? "border-red-500" : ""}
                    />
                    {getFieldErrors('firstname').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input 
                      id="lastname" 
                      name="lastname" 
                      value={editedScholar?.lastname} 
                      onChange={handleInputChange} 
                      className={getFieldErrors('lastname').length > 0 ? "border-red-500" : ""}
                    />
                    {getFieldErrors('lastname').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                </div>

                {/* Age and Mobile Number Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      name="age" 
                      type="text"
                      value={editedScholar?.age} 
                      onChange={handleInputChange}
                      className={getFieldErrors('age').length > 0 ? "border-red-500" : ""}
                    />
                    {getFieldErrors('age').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobilenumber">Mobile Number</Label>
                    <Input 
                      id="mobilenumber" 
                      name="mobilenumber" 
                      value={editedScholar?.mobilenumber} 
                      onChange={handleInputChange} 
                      className={getFieldErrors('mobilenumber').length > 0 ? "border-red-500" : ""}
                    />
                    {getFieldErrors('mobilenumber').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                </div>

                {/* Year Level - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="yearLevel">Year Level</Label>
                  <Input 
                    id="yearLevel" 
                    name="yearLevel" 
                    value={editedScholar?.yearLevel} 
                    onChange={handleInputChange} 
                    className={getFieldErrors('yearLevel').length > 0 ? "border-red-500" : ""}
                  />
                  {getFieldErrors('yearLevel').map((error, index) => (
                    <p key={index} className="text-red-500 text-sm">{error}</p>
                  ))}
                </div>

                {/* School and Barangay Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('school', value)} 
                      defaultValue={editedScholar?.school?.id?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.school_id} value={school.school_id.toString()}>
                            {school.school_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldErrors('school').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('barangay', value)} 
                      defaultValue={editedScholar?.barangay?.id?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a barangay" />
                      </SelectTrigger>
                      <SelectContent>
                        {barangays.map((barangay) => (
                          <SelectItem key={barangay.baranggay_id} value={barangay.baranggay_id.toString()}>
                            {barangay.baranggay_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldErrors('barangay').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full text-white bg-[#191851] hover:bg-[#191851]/90"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

