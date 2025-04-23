import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://backend.ddev.site/api';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }
  getImageUrl(path: string): string {
    if (!path) return 'assets/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }
  
  

  // Update user profile with FormData (for file uploads)
  updateUserProfileWithImage(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`, formData);
  }

  // Change password
  changePassword(passwordData: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update-password`, passwordData);
  }

  // Update profile image only
  updateProfileImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    return this.http.post(`${this.apiUrl}/user`, formData);
  }

  // Remove profile image
  removeProfileImage(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/remove-profile-picture`);
  }
}


export { User };

