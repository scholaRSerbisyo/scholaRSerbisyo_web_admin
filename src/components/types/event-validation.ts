export interface EventType {
  event_type_id: number;
  name: string;
}

export interface School {
  school_id: number;
  school_name: string;
}

export interface Baranggay {
  baranggay_id: number;
  baranggay_name: string;
}

export interface EventValidation {
  event_validation_id: number;
  admin_id: number;
  admin_type_name: string;
  event_image_uuid: string;
  event_name: string;
  description: string;
  date: string;
  time_from: string;
  time_to: string;
  location: string;
  status: 'pending' | 'accepted' | 'declined';
  event_type_id: number;
  school_id?: number;
  baranggay_id?: number;
  event_type?: EventType;
  school?: School;
  barangay?: Baranggay;
}

export interface EventValidationTableProps {
  eventValidations: EventValidation[];
  onAcceptEvent: (id: number) => Promise<void>;
  onDeclineEvent: (id: number) => Promise<void>;
}

