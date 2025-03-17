"use server"

import { cookies } from "next/headers"
import API_URL from "@/constants/constants"

export interface NotificationData {
    event_id: number | undefined;
    event_name: string;
    event_type_name: string; // Add this line
    description: string;
    date: string;
    time_from: string;
    time_to: string;
    event_image_uuid: string;
  }  

  export const sendPushNotification = async (notificationData: NotificationData) => {
    const token = cookies().get("session")?.value
  
    if (!token) {
      console.error('No session token found')
      return { success: false, message: 'No session token found' }
    }
  
    try {
      console.log('Sending push notification request to:', `${API_URL}/api/events/send-notification`)
      console.log('Request data:', JSON.stringify(notificationData, null, 2))
      console.log('Authorization token:', token.substring(0, 10) + '...')  // Log first 10 characters of token for debugging
  
      const response = await fetch(`${API_URL}/api/events/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      })
  
      const responseText = await response.text()
      console.log('Raw response:', responseText)
  
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        return { success: false, message: 'Error parsing server response' }
      }
  
      if (!response.ok) {
        console.error('Push notification request failed:', result)
        throw new Error(result.message || `Failed to send broadcast notification: ${response.statusText}`)
      }
  
      console.log('Push notification sent successfully:', result)
      return { success: true, message: 'Notification sent successfully', data: result }
    } catch (error) {
      console.error('Error sending broadcast notification:', error)
      return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
  }
  
  export const fetchNotifications = async () => {
    const token = cookies().get("session")?.value
  
    try {
      const response = await fetch(`${API_URL}/api/events/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
  
      return await response.json()
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }
  
  export const markNotificationAsRead = async (notificationId: number) => {
    const token = cookies().get("session")?.value
  
    try {
      const response = await fetch(`${API_URL}/api/events/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }
  
      return await response.json()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

