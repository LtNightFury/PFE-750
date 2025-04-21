import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/models/user.model';  // Adjust path if needed;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://backend.ddev.site/api'; // Your Symfony API URL
  private tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  private handleAuth(token: string): void {
    this.setToken(token);
    const decodedToken = this.jwtHelper.decodeToken(token) as User;
    this.currentUserSubject.next(decodedToken);
  }
  
  constructor(private http: HttpClient) {
    
    // Check for stored token and update current user on app initialization
    const token = this.getToken();
if (token && !this.jwtHelper.isTokenExpired(token)) {
  const decodedToken = this.jwtHelper.decodeToken(token) as User;
  this.currentUserSubject.next(decodedToken);
  } else {
  this.logout();
  }

  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login_check`, { username: email, password })
      .pipe(
        tap(response => {
          if (response?.token) {
            this.handleAuth(response.token);
          }
          
        })
      );
  }
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  register(name: string, email: string, password: string,phoneNumber:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, name,phoneNumber });
  }
  


  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { token, password });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
