import React from 'react'
import Image from "next/image"
import { getImage } from "@/components/Events/_actions/events"
import { Event } from "@/components/types"

export function CommunityEventImage({ event, title }: { event: Event, title: string }) {
  const [imageUrl, setImageUrl] = React.useState(event.image);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

    const loadImage = React.useCallback(async () => {
        if (!imageUrl && retryCount < maxRetries) {
        try {
            const newUrl = await getImage(event.event_image_uuid);
            if (newUrl) {
            setImageUrl(newUrl);
            } else {
            throw new Error("Failed to get image URL");
            }
        } catch (error) {
            console.error(`Failed to load image for event ${event.event_id}:`, error);
            setRetryCount(prevCount => prevCount + 1);
        }
        }
    }, [event.event_image_uuid, event.event_id, imageUrl, retryCount]);

    React.useEffect(() => {
        loadImage();
    }, [loadImage]);

    if (!imageUrl) {
        return (
        <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">
            {retryCount < maxRetries ? "Loading..." : "No Image"}
            </span>
        </div>
        );
    }

    const headerColorClass = 
        title === 'Ongoing Events' ? "bg-green-500" :
        title === 'Upcoming Events' ? "bg-primary" :
        "bg-yellow-300";

    return (
        <Image 
        src={imageUrl}
        alt={event.event_name || "Event Image"} 
        width={200} 
        height={100} 
        className={`w-full h-24 object-cover ${headerColorClass} rounded-t-lg`}
        onError={() => {
            console.error(`Failed to load image: ${imageUrl}`);
            setImageUrl("");  // Reset the URL to trigger a retry
            setRetryCount(prevCount => prevCount + 1);
        }}
        />
    );
}