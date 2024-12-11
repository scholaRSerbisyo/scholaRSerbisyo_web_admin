"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

const token = cookies().get("session")?.value;

export const getScholarEvents = async (scholarId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/events/scholars/${scholarId}`, {
        cache: 'no-store',
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        const message = data?.message || 'An error occurred while fetching events'
        return { error: message }
      }
  
      return {
        scholar: data.scholar,
        events: data.events
      }
    } catch (error) {
      console.error('Error fetching scholar events:', error)
      return { error: 'An unexpected error occurred' }
    }
  }
  
  export const getScholars = async () => {
      try {
          const response = await fetch(`${API_URL}/api/events/scholars/return-service-count`, {
              cache: 'no-store',
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              }
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              const message = data?.message || 'An error occurred while fetching scholars';
              return { error: message };
          }
  
          return {
              scholars: data.scholars,
              total: data.total
          };
      } catch (error) {
          console.error('Error fetching scholars:', error);
          return { error: 'An unexpected error occurred' };
      }
  }
  
  export async function getImage(imageUuid: string) {
      try {
          const response = await fetch(`${API_URL}/api/events/getimage`, {
              cache: 'no-store',
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ image_uuid: imageUuid })
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              console.error('Error fetching image URL:', errorData.error || 'Unknown error');
              return null;
          }
  
          const data = await response.json();
          if (!data.url) {
              console.error('Image URL not found in response');
              return null;
          }
          return data.url;
      } catch (error) {
          console.error('Error fetching image URL:', error);
          return null;
      }
  }