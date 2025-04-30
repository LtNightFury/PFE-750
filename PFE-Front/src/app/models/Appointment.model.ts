// src/app/models/appointment.model.ts
export interface Appointment {
    id?: number;
    propertyId: number;
    name: string;
    email: string;
    phone: string;
    lastName: string;
    userPhone: string;
    appointmentDate: string; // ISO string format
    appointmentTime: string; // Format: "HH:MM"
    message?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
    userId?: number;
    propertyTitle: string;
  propertycity: string;
  propertysubcity?: string;
  }