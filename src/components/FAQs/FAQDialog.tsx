"use client"

import * as React from "react"
import { Search, Plus, X, Loader2, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateFAQDialog } from "./CreateFAQDialog"
import { getAllFAQs } from "./_actions/action"
import { useToast } from "@/hooks/use-toast"

interface FAQ {
  faq_id: number
  question: string
  answer: string
  created_at: string
  updated_at: string
}

interface FAQDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function FAQDialog({ isOpen, onClose }: FAQDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [faqs, setFaqs] = React.useState<FAQ[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true)
        const response = await getAllFAQs()
        if (response.faqs && Array.isArray(response.faqs)) {
          setFaqs(response.faqs)
        } else {
          throw new Error("FAQs not found in the response or is not an array")
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An unexpected error occurred while loading FAQs.",
          variant: "destructive",
        })
        setFaqs([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchFAQs()
    }
  }, [isOpen, toast])

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateFAQ = (question: string, answer: string) => {
    const newFAQ: FAQ = {
      faq_id: Math.max(...faqs.map(f => f.faq_id), 0) + 1,
      question,
      answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setFaqs([...faqs, newFAQ])
  }

  const handleEditFAQ = (faq: FAQ) => {
    // Implement edit functionality
    console.log("Edit FAQ:", faq)
  }

  const handleDeleteFAQ = (faq: FAQ) => {
    // Implement delete functionality
    console.log("Delete FAQ:", faq)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions (FAQs)</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search question..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="bg-[#191851] text-white hover:bg-[#191851]/90"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create FAQ
            </Button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : faqs.length === 0 ? (
              <p className="text-center text-muted-foreground">No FAQs available.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.faq_id} value={`item-${faq.faq_id}`}>
                    <div className="flex items-center">
                      <AccordionTrigger className="text-left w-[37rem]">
                        {faq.question}
                      </AccordionTrigger>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditFAQ(faq)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFAQ(faq)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </DialogContent>

      <CreateFAQDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateFAQ}
      />
    </Dialog>
  )
}

