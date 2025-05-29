import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model'; // Add this import

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://backend.ddev.site/api/booking';

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  getNewOwnerNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/owner/new-booking-notifications`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/${id}/read`, {});
  }
}