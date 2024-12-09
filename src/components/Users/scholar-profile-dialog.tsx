"use client"

import { ChevronLeft } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Scholar } from './UserFrame'
import { GraduationCap, MapPin, Phone } from 'lucide-react'

interface ScholarProfileDialogProps {
  scholar: Scholar | null
  open: boolean
  onClose: () => void
}

export function ScholarProfileDialog({ scholar, open, onClose }: ScholarProfileDialogProps) {
  if (!scholar) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="relative bg-white rounded-t-2xl">
          {/* Header */}
          <div className="bg-[#191851] text-white p-4 rounded-t-lg">
            
            <h2 className="text-xl font-semibold mb-14 text-center">Profile</h2>
          </div>

          {/* Profile Content */}
          <div className="px-4 py-6">
            {/* Profile Image */}
            <div className="flex justify-center -mt-20 mb-1">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 bg-white">
                  <img
                    src="/logo.png"
                    alt={`${scholar.firstname} ${scholar.lastname}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Scholar Name */}
            <h3 className="text-lg font-bold text-black text-center mb-5">
              {scholar.firstname} {scholar.lastname}
            </h3>

            {/* Scholar Details */}
            <div className="space-y-4 px-12 pb-4">
              <div className="flex items-center gap-3 text-gray-600">
                <GraduationCap color='#FDB316' className="h-5 w-5 text-[#191851]" />
                <span>Studied at <span className='font-semibold'>{scholar.school.name}</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin color='#FDB316' className="h-5 w-5 text-[#191851]" />
                <span>Live in <span className='font-semibold'>{scholar.barangay.name}</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone color='#FDB316' className="h-5 w-5 text-[#191851]" />
                <span className='font-semibold'>{scholar.mobilenumber}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

