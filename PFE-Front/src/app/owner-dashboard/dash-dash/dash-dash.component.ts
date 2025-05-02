import { Component } from '@angular/core';
import{ Router } from '@angular/router';
import { Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';
import { Appointment } from 'src/app/models/Appointment.model';


@Component({
  selector: 'app-dash-dash',
  templateUrl: './dash-dash.component.html',
  styleUrls: ['./dash-dash.component.css']
})
export class DashDashComponent {

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
  upcomingAppointments: Appointment[] = [];

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
    this.loadUpcomingAppointments();
    let totalViews = 0;
this.propertyService.getAllPropertiesByOwnerId().subscribe(properties => {
  totalViews = properties.reduce((sum, p) => sum + (Number(p.views) || 0), 0);  this.totalViews = totalViews;
});

  }
  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        
        this.approvedPropertiesCount = data.filter(p => p.approval === 'approved' || this.appointments.some(a => a.status === 'confirmed')).length;
        this.properties = data;        this.filteredProperties = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load properties. Please try again.';
        this.isLoading = false;
      }
    });
  }
  loadAppointments(): void {
    this.propertyService.getUserAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.upcomingAppointmentsCount = data.filter(a => a.status === 'confirmed').length;
      },
      error: (err) => {
        this.error = 'Failed to load appointments. Please try again.';
      }
    });
  }
  loadUpcomingAppointments(): void {
    this.propertyService.getOwnerAppointments().subscribe({
      next: (appointments) => {
        const currentDate = new Date();
        this.upcomingAppointments = appointments.filter(appt => new Date(appt.appointmentDate) > currentDate);
      },
      error: (err) => {
        console.error('Failed to fetch appointments', err);
      }
    });
  }
}