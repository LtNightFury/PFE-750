import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = 'http://backend.ddev.site/api/properties/';  // Replace with your Symfony API endpoint

  constructor(private http: HttpClient) {}


  //TEMPORARY 5ATER KHALIL YB3TH FIHOM TEXT
  getPropertiesFromTextFile(): Observable<Property[]> {
    return this.http.get('assets/properties.txt', { responseType: 'text' })
      .pipe(
        map(text => JSON.parse(text)), // Parse the raw text into JSON
        map((properties: any[]) => {
          // Set a main image for each property if one exists
          return properties.map(property => {
            if (property?.Media?.photos?.length > 0) {
              property.mainImage = 'http://localhost:8000' + property.Media.photos[0].imageName;
            } else {
              property.mainImage = ''; // fallback image
            }
            return property;
          });
        })
      );
  }
  //TOUFA LENA EL METHODE

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