import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';
import { Appointment } from 'src/app/models/Appointment.model';

@Component({
  selector: 'app-owner-dash',
  templateUrl: './owner-dash.component.html',
  styleUrls: ['./owner-dash.component.css']
})
export class OwnerDashComponent {

  properties: Property[] = [];
  appointments: Appointment[] = [];
  filteredProperties: Property[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  totalViews: number = 0;
  approvedPropertiesCount: number = 0;
  pendingRequestsCount: number = 2; // Placeholder until you wire messaging
  newMessagesCount: number = 1;     // Placeholder
  upcomingAppointmentsCount: number = 0;
  
  // Filter state
  currentFilters: any = {};
  
  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    this.loadAppointments();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.totalViews = data.reduce((sum, p) => sum + (Number(p.viewCount) || 0), 0);
        this.approvedPropertiesCount = data.filter(p => p.approval === 'approved' || this.appointments.some(a => a.status === 'confirmed')).length;
        this.properties = data;        this.filteredProperties = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load properties. Please try again.';
        this.isLoading = false;
        console.error('Error loading properties:', err);
      }
    });
  }

  loadAppointments(): void {
    this.propertyService.getOwnerAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        const now = new Date();
        this.upcomingAppointmentsCount = data.filter(a => new Date(a.appointmentDate) >= now).length;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      }
    });
  }

  onFilterChanged(filters: any): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.properties];
    
    // Apply each filter if it has a value
    if (this.currentFilters.dealType) {
      filtered = filtered.filter(p => 
        p.generalinfo.deal_type.toLowerCase() === this.currentFilters.dealType.toLowerCase());
    }
    
    if (this.currentFilters.type) {
      filtered = filtered.filter(p => 
        p.generalinfo.propertyType.toLowerCase() === this.currentFilters.type.toLowerCase());
    }
    
    if (this.currentFilters.city) {
      filtered = filtered.filter(p => 
        p.location.city.toLowerCase().includes(this.currentFilters.city.toLowerCase()));
    }
    
    if (this.currentFilters.minPrice) {
      filtered = filtered.filter(p => 
        Number(p.price.price) >= this.currentFilters.minPrice);
    }
    
    if (this.currentFilters.maxPrice && this.currentFilters.maxPrice > 0) {
      filtered = filtered.filter(p => 
        Number(p.price.price) <= this.currentFilters.maxPrice);
    }
    
    if (this.currentFilters.search) {
      const search = this.currentFilters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.generalinfo.title.toLowerCase().includes(search) || 
        p.generalinfo.description.toLowerCase().includes(search) ||
        p.location.city.toLowerCase().includes(search) ||
        p.location.country.toLowerCase().includes(search)
      );
    }
    
    this.filteredProperties = filtered;
  }

  addNewProperty(): void {
    this.router.navigate(['/properties/add']);
  }

  clearAllFilters(): void {
    this.currentFilters = {};
    this.filteredProperties = this.properties;
  }

  exportProperties(): void {
    // Implement export logic here - could be CSV or Excel export
    const propertiesJson = JSON.stringify(this.filteredProperties, null, 2);
    const blob = new Blob([propertiesJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-properties.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
