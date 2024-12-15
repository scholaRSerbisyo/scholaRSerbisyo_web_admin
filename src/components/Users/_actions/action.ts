"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { Baranggay, School } from "@/components/types";

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

  export const updateScholarInfo = async (scholarId: number, scholarData: any) => {
    try {
        const response = await fetch(`${API_URL}/api/user/admin/scholar/${scholarId}/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(scholarData)
        });

        const data = await response.json();

        console.error(data)

        if (!response.ok) {
            const message = data?.message || 'An error occurred while updating scholar information';
            return { error: message };
        }

        return {
            scholar: data.scholar
        };
    } catch (error) {
        console.error('Error updating scholar information:', error);
        return { error: 'An unexpected error occurred while updating scholar information' };
    }
}

export const getSchools = async () => {
    const token = cookies().get("session")?.value
    try {
        const req = await fetch(`${API_URL}/api/school/getschools`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const res = await req.json();

        if (!req.ok) {
            const message = res?.message || "Failed to fetch schools";
            return { message };
        }

        return res as School[];
    } catch (error: any) {
        console.error("Error fetching schools:", error);
        return { message: error.message || "An error occurred" };
    }
};

export const getBaranggays = async () => { 
    const token = cookies().get('session')?.value
    try {
        const req = await fetch(`${API_URL}/api/baranggay/getbaranggays`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const res = await req.json();

        if (!req.ok) {
            const message = res?.message || "Failed to fetch barangay";
            return { message };
        }

        return res as Baranggay[];
    } catch (error: any) {
        console.error("Error fetching barangays:", error);
        return { message: error.message || "An error occurred" };
    }
};