import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  created_at: string;
  updated_at: string;
}

export interface Slot {
  id: string;
  doctor_id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  doctors?: Doctor;
}

export interface Booking {
  id: string;
  patient_name: string;
  patient_phone: string;
  doctor_id: string;
  slot_id: string | null;
  booking_date: string;
  booking_time: string;
  status: 'potwierdzona' | 'przelożona' | 'anulowana';
  created_at: string;
  updated_at: string;
  doctors?: Doctor;
}

export interface CallLog {
  id: string;
  phone_number: string;
  transcript: string;
  intent: 'book' | 'cancel' | 'reschedule' | 'info' | 'other';
  outcome: 'sukces' | 'przekazanie' | 'brak_dopasowania';
  metadata: Record<string, any>;
  call_duration: number;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}
