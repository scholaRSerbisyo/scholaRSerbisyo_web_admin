import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useState, useEffect } from 'react'
import { getImage } from '@/components/Events/_actions/events'

interface ProofOverlayProps {
  isOpen: boolean
  onClose: () => void
  submission: {
    time_in: string
    time_out: string
    time_in_location: string
    time_out_location: string
    time_in_image_uuid: string
    time_out_image_uuid: string
    description?: string
  } | null
}

export function ProofOverlay({ isOpen, onClose, submission }: ProofOverlayProps) {
  const [timeInImageUrl, setTimeInImageUrl] = useState<string | null>(null)
  const [timeOutImageUrl, setTimeOutImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (submission) {
      const fetchImages = async () => {
        const timeInUrl = await getImage(submission.time_in_image_uuid)
        const timeOutUrl = await getImage(submission.time_out_image_uuid)
        setTimeInImageUrl(timeInUrl)
        setTimeOutImageUrl(timeOutUrl)
      }
      fetchImages()
    }
  }, [submission])

  if (!submission) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] text-black border-4 border-[#1a1f6f] p-0 bg-white">
        <div className="p-6 space-y-6">
          <div className="flex justify-start items-start">
            <div className="text-[#1a1f6f] font-bold text-xl">Submission</div>
          </div>

          <div className="space-y-4 text-sm border p-4 rounded-md">
            <div>
              <h2 className="text-xl font-bold text-[#1a1f6f]">Scholar's Cup Proof</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-black">
              <div>
                <p className="font-semibold">Time In:</p>
                <p>{format(new Date(submission.time_in), 'h:mma')}</p>
              </div>
              <div>
                <p className="font-semibold">Time Out:</p>
                <p>{format(new Date(submission.time_out), 'h:mma')}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p className="break-words">{submission.time_in_location}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p className="break-words">{submission.time_out_location}</p>
              </div>
            </div>

            {submission.description && (
              <div>
                <p className="font-semibold">Description:</p>
                <p className="text-sm text-gray-600">{submission.description}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="font-semibold">Time-In and Time-Out Photos</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video relative overflow-hidden rounded-lg border">
                  {timeInImageUrl ? (
                    <img
                      src={timeInImageUrl}
                      alt="Time in proof"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
                <div className="aspect-video relative overflow-hidden rounded-lg border">
                  {timeOutImageUrl ? (
                    <img
                      src={timeOutImageUrl}
                      alt="Time out proof"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

