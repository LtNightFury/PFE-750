import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = 'http://localhost:8000/api/properties';  // Replace with your Symfony API endpoint

  constructor(private http: HttpClient) {}

  // Get all properties
  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  // Get a single property by ID
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  // Add a new property
  addProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  // Update an existing property
  updateProperty(id: number, property: Property): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, property);
  }

  // Delete a property
  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}