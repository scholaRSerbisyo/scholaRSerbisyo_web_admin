"use server"

import { cookies } from "next/headers"
import API_URL from "@/constants/constants"

interface NotificationData {
  title: string;
  body: string;
  data: {
    eventId: number;
    eventName: string;
    eventType: string;
    description: string;
    date: string;
    timeFrom: string;
    timeTo: string;
  };
}

export const sendPushNotification = async (notificationData: NotificationData) => {
  const token = cookies().get("session")?.value

  try {
    const response = await fetch(`${API_URL}/api/events/send-push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    })

    if (!response.ok) {
      throw new Error('Failed to send push notification')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending push notification:', error)
    throw error
  }
}

