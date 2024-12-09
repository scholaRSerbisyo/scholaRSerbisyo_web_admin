export interface Event {
    event_id: number
    event_name: string
    event_image_uuid: string
    event_type_id: number
    created_at: string
    date: string
    description: string
    location: string
    status: string
    time_from: string
    time_to: string
    admin_id: number
    baranggay_id: number
    school_id: number
    scholar_id: number | null
    submission_image_uuid: string | null
    submissions: string | null
    time_in: string | null
    time_out: string | null
    updated_at: string
    imageUrl?: string
  }
  
  export interface UpdateEventPayload {
    event_id: number;
    event_name: string;
    event_type_id: number;
    date: string;
    description: string;
    location: string;
    time_from: string;
    time_to: string;
    baranggay_id: number;
    school_id: number;
    event_image_uuid?: string;
  }