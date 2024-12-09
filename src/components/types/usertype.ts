import { Baranggay, School } from "."

export interface User {
    user_id: number
    email: string
    password?: string
    email_verified_at: string | null
    role_id: number
    remember_token: string | null
    created_at: string
    updated_at: string
    admin: Admin
}

interface Admin {
    admin_id: number
    admin_name: string
    admin_type_id: number
    user_id: number
    event_type_id: number
    created_at: string
    updated_at: string
}

export interface Scholar {
    scholar_id: number
    firstname: string
    lastname: string
    age: number
    address: string
    mobilenumber: string
    yearlevel: string
    scholar_type_id: number
    user_id: number
    school_id: number
    baranggay_id: number
    created_at: string
    updated_at: string
    user: User
    school: School
    baranggay: Baranggay
}

export interface ScholarWithStatus extends Scholar {
    status: "Complete" | "Incomplete" | "Inactive"
}