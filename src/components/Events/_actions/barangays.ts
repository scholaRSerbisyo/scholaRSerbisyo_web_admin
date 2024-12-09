"use server";

import API_URL from "@/constants/constants";
import { Baranggay, Baranggay2 } from "@/components/types";

export const getBaranggays = async (token: string) => { 
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

export async function getBaranggay(id: string, token: string): Promise<Baranggay2> {
    try {
      const response = await fetch(`${API_URL}/api/baranggay/baranggays/${id}`, {
        cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
      });
      if (!response.ok) throw new Error("Failed to fetch barangay details");
      const baranggay = await response.json();

      console.log(baranggay)
      return baranggay;
    } catch (error) {
      console.error("Error fetching barangay:", error);
      throw new Error(`Failed to fetch barangay data: ${error}`); // Or re-throw the error if preferred
    }
  }