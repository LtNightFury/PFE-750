import { Component } from '@angular/core';
import { Appointment } from 'src/app/models/Appointment.model';
import { PropertyService } from 'src/app/services/property.service';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class MyAppointmentsComponent {
  appointments: Appointment[] = [];
  isLoading = true;

  constructor(private propertyService: PropertyService ,userService: UserService) { }

  ngOnInit(): void {
    
    this.propertyService.getUserAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed to load appointments');
      }
    });
  }
  formatStatus(status: string|undefined): string {
    if (!status) return '';
    return status === 'approved' ? 'Confirmed' : status.charAt(0).toUpperCase() + status.slice(1);
  }  
  getStatusBadgeClass(status: string|undefined): string {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'confirmed':
      case 'approved': // treat approved as confirmed
        return 'confirmed';
      case 'canceled':
        return 'cancelled';
      default:
        return '';
    }
  }
  
  getStatusClass(status: string|undefined): string {
    return `marker-${status === 'approved' ? 'confirmed' : status}`;
  }
  getImageUrl(path: string): string {
    if (!path) return '/assets/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }
  

}
