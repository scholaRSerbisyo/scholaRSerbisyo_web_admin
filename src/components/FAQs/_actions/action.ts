"use server"

import API_URL from "@/constants/constants"
import { cookies } from "next/headers"


export const addFAQ = async (faqData: { question: string; answer: string }) => {
    const token = cookies().get("session")?.value
  
    try {
      const response = await fetch(`${API_URL}/api/faqs/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add FAQ')
      }
  
      return { message: data.message, status: response.status, faq: data.FAQ }
    } catch (error) {
      console.error('Error adding FAQ:', error)
      throw error
    }
  }

  export const getAllFAQs = async () => {
    const token = cookies().get("session")?.value
  
    try {
      const response = await fetch(`${API_URL}/api/faqs/getfaqs`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
  
      if (!Array.isArray(data.faqs)) {
        console.error('Unexpected response structure:', data)
        throw new Error('FAQs not found in the response or is not an array')
      }
  
      return { message: data.message, status: response.status, faqs: data.faqs }
    } catch (error) {
      console.error('Error getting all FAQs:', error)
      throw error
    }
  }
  