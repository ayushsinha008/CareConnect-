
export type UserRole = 'PATIENT' | 'DOCTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Doctor extends User {
  speciality: string;
  experience: number;
  rating: number;
  fee: number;
  availability: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  type: 'TELECONSULTATION' | 'IN_CLINIC';
}

export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'WEIGHT' | 'DIABETES' | 'BP' | 'TEMP';
  value: number;
  unit: string;
  date: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medicines: string[];
  instructions: string;
  date: string;
}

export enum Page {
  WELCOME = 'WELCOME',
  LANGUAGE = 'LANGUAGE',
  LOGIN = 'LOGIN',
  PATIENT_HOME = 'PATIENT_HOME',
  DOCTOR_HOME = 'DOCTOR_HOME',
  DOCTOR_LIST = 'DOCTOR_LIST',
  BOOKING = 'BOOKING',
  MY_HEALTH = 'MY_HEALTH',
  APPOINTMENTS = 'APPOINTMENTS',
  AI_CHECK = 'AI_CHECK',
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  VIDEO_CALL = 'VIDEO_CALL',
  MANAGE_AVAILABILITY = 'MANAGE_AVAILABILITY',
  REFER_AND_EARN = 'REFER_AND_EARN'
}
