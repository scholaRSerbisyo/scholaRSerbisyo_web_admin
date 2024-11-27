"use server"

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { School } from "@/components/types";

const token = cookies().get('session')?.value;

export const getSchools = async () => { 
    try {
        const req: any = await fetch(`${API_URL}/api/school/getschools`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })

        const res = await req.json()

        console.log(res)

        if(!req.ok) {
            const message = res?.message
            return { message }
        }
        else
        {
            return res
        }
    } catch (error) {
        const message = error
        return { message }
    }
}

export async function getSchool(id: string): Promise<School> {
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    try {
      const response = await fetch(`${API_URL}/api/school/schools/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });


      console.log(response)
  
      if (!response.ok) {
        throw new Error(`Failed to fetch school data: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!data || typeof data !== 'object' || !('school_id' in data)) {
        throw new Error('Invalid school data received');
      }
  
      return data as School;
    } catch (error) {
      console.error('Error fetching school data:', error);
      throw error;
    }
  }
  