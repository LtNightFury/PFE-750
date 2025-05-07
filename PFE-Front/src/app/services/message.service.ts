import { Injectable } from '@angular/core';
import { EmailData } from './property.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private baseApiUrl = 'http://backend.ddev.site/api';

  constructor(private http: HttpClient) { }
   sendEmailToOwner(emailData: EmailData): Observable<any> {
      return this.http.post(`${this.baseApiUrl}/properties/${emailData.propertyId}/send-email`, emailData);
    }
    getEmailMessages(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseApiUrl}/owner/messages`);
    }
    sendOwnerReply(messageId: number, body: { message: string }): Observable<any> {
      return this.http.post(`${this.baseApiUrl}/owner/messages/${messageId}/reply`, body);
    }
    markMessageAsRead(messageId: number): Observable<any> {
      return this.http.put(`${this.baseApiUrl}/messages/${messageId}`, {});
    }
    getUnreadMessageCount(): Observable<number> {
      return this.http.get<number>(`${this.baseApiUrl}/messagescount`);
    }
    getUserMessages(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseApiUrl}/user/messages`);
    }
     sendUserReply(messageId: number, body: { message: string }): Observable<any> {
      return this.http.post(`${this.baseApiUrl}/user/messages/${messageId}/reply`, body);
    }
}
