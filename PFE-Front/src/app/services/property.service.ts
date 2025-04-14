import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = 'http://backend.ddev.site/api/properties/';  // Symfony API endpoint

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
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}${id}`);
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
