'use client'

import { useState, useEffect } from 'react'
import { EventValidation } from '@/components/types/event-validation'
import { EventValidationTable } from '@/components/Events/Validation/EventValidationTable'
import { useToast } from '@/hooks/use-toast'
import { fetchEventValidations, acceptEvent, handleDeclineEvent } from '@/components/Events/_actions/events'

export default function EventValidationsPage() {
  const [eventValidations, setEventValidations] = useState<EventValidation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadEventValidations()
  }, [])

  const loadEventValidations = async () => {
    try {
      setIsLoading(true)
      const data = await fetchEventValidations()
      setEventValidations(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch event validations"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptEvent = async (id: number) => {
    try {
      await acceptEvent(id)
      
      toast({
        title: "Success",
        description: "Event accepted successfully"
      })
      
      // Refresh the list
      await loadEventValidations()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept event"
      })
    }
  }

  const handleDeclineEventClick = async (id: number) => {
    try {
      await handleDeclineEvent(id)
      
      toast({
        title: "Success",
        description: "Event declined successfully"
      })
      
      // Refresh the list
      await loadEventValidations()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decline event"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Event Validations</h1>
      <EventValidationTable 
        eventValidations={eventValidations}
        onAcceptEvent={handleAcceptEvent}
        onDeclineEvent={handleDeclineEventClick}
      />
    </div>
  )
}

