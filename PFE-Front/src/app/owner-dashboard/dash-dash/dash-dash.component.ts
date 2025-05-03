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
  pendingRequestsCount: number =0; // Placeholder until you wire messaging
  newMessagesCount: number = 0;     // Placeholder
  upcomingAppointmentsCount: number = 0;
  upcomingAppointments: Appointment[] = [];
  allPropertiesCount: number = 0;

  // Filter state
  currentFilters: any = {};

  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.loadAllProperties();
    this.loadappProperties();
    this.loadpendingrequest();
    this.loadAppointments();
    this.loadUpcomingAppointments();
    this.loadMessages();

    let totalViews = 0;
    this.propertyService.getTotalViewsForOwner().subscribe({
      next: (res) => {
        this.totalViews = res.totalViews;
        this.isLoading = false;
      },
});

  }
  loadappProperties(): void {
    this.isLoading = true;
    this.propertyService.getApprovedPropertiesCount().subscribe({
      next: (data) => {
        this.approvedPropertiesCount = data.approvedProperties;
      },
      error: (err) => {
        console.error('Failed to fetch approved properties count:', err);
      },
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
  loadAllProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllPropertiesCount().subscribe({
      next: (data) => this.allPropertiesCount = data.allProperties,
      error: (err) => console.error('Error fetching all properties count:', err),
    });

}
loadpendingrequest(): void {
  this.propertyService.getPendingAppointmentsCount().subscribe({
    next: (data) => {
      
      this.pendingRequestsCount = data.pendingAppointmentsCount;
    },
    error: (err) => {
      console.error('Error fetching owner appointments:', err);
    }
  });
}
loadMessages(): void {
  this.propertyService.getUnreadMessageCount().subscribe({
    next: (count) => {
      this.newMessagesCount = count;
    },
    error: (err) => {
      console.error('Error fetching unread messages count:', err);
    }
  });
}
}