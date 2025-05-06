import { Injectable } from '@angular/core';
import { Booking, Property } from '../models/property.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Appointment } from '../models/Appointment.model';
import { PropertyView } from '../models/property-view.model';

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  propertyId: number;
  recipientId: number;
}
@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  
  private apiUrl2 = 'http://backend.ddev.site/api/user/properties';  // Symfony API endpoint
  private apiUrl = 'http://backend.ddev.site/api/properties/';  // Symfony API endpoint
  private baseApiUrl = 'http://backend.ddev.site/api';

  constructor(private http: HttpClient) {}

  // ✅ Get all properties from backend and set mainImage path
  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl).pipe(
      map((properties: any[]) => {
        return properties.map(property => {
          if (property?.Media?.photos?.length > 0) {
            property.mainImage = 'http://backend.ddev.site' + property.Media.photos[0].imageName;
          } else {
            property.mainImage = '/assets/default.jpg'; // fallback
          }
          return property;
        });
      })
    );
  }

  getAllPropertiesByOwnerId(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl2}`).pipe(
      map((properties: any[]) => {
        return properties.map(property => {
          if (property?.Media?.photos?.length > 0) {
            property.mainImage = 'http://backend.ddev.site' + property.Media.photos[0].imageName;
          } else {
            property.mainImage = '/assets/default.jpg'; // fallback
          }
          return property;
        });
      })
    );}

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}${id}`);
  }
  addBooking(propertyId: number, booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`http://backend.ddev.site/api/booking/properties/${propertyId}/book`, booking);
    
  }
  
  // Add a new property
  addProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }
  // Fetch user bookings
  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>('http://backend.ddev.site/api/booking/my-bookings');
  }
  

  // Update an existing property
  updateProperty(id: number, property: Property): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, property);
  }

  // Delete a property
  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  scheduleAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>('http://backend.ddev.site/api/appointments', appointment);
  }
  
  getAvailableAppointmentSlots(propertyId: number, date: string): Observable<{ date: string; availableSlots: string[] }> {
    return this.http.get<{ date: string; availableSlots: string[] }>(
      `http://backend.ddev.site/api/properties/${propertyId}/available-slots?date=${date}`
    );
  }
  getUserAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('http://backend.ddev.site/api/my-appointments');
  }
  getOwnerAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`http://backend.ddev.site/api/owner/appointments`);
  }

  updateAppointmentStatus(appointmentId: number, status: 'approved' | 'canceled'): Observable<any> {
    return this.http.patch(`http://backend.ddev.site/api/appointments/${appointmentId}/approve`, { status });
  }
  
  // New method for sending email to property owner/agent
  sendEmailToOwner(emailData: EmailData): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/properties/${emailData.propertyId}/send-email`, emailData);
  }
  getEmailMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/owner/messages`);
  }
  recordView(propertyId: number): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/properties/${propertyId}/view`, {});
  }
  getPropertyViews(propertyId: number): Observable<number> {
    return this.http.get<number>(`${this.baseApiUrl}/properties/${propertyId}/views`);
  }  
  getUserViews(): Observable<{ views: PropertyView[] }> {
    return this.http.get<{ views: PropertyView[] }>(`${this.baseApiUrl}/user/views`);
  }
  getTotalViewsForOwner(): Observable<{ totalViews: number }> {
    return this.http.get<{ totalViews: number }>('http://backend.ddev.site/api/owner/allviews');
  }
  getApprovedPropertiesCount(): Observable<{ approvedProperties: number }> {
    return this.http.get<{ approvedProperties: number }>(`${this.baseApiUrl}/owner/approved-properties`);
  }
  getAllPropertiesCount(): Observable<{ allProperties: number }> {
    return this.http.get<{ allProperties: number }>(`${this.baseApiUrl}/owner/all-properties-count`);
  }
  getPendingAppointmentsCount(): Observable<{ pendingAppointmentsCount: number }> {
    return this.http.get<{ pendingAppointmentsCount: number }>(`${this.baseApiUrl}/owner/countappointments`);
  }
  // In property.service.ts or a new message.service.ts
getUnreadMessageCount(): Observable<number> {
  return this.http.get<number>(`${this.baseApiUrl}/messagescount`);
}
  
getmonthlyviews(): Observable<{ views: PropertyView[] }> {
  return this.http.get<{ views: PropertyView[] }>(`${this.baseApiUrl}/owner/views`);
}
}
