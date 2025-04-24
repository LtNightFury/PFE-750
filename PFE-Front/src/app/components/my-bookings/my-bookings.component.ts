import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/services/property.service';
import { Booking } from 'src/app/models/property.model';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    // Fetching bookings from the backend
    this.propertyService.getUserBookings().subscribe((data: Booking[]) => {
      this.bookings = data;
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) {
      return 'badge-secondary'; // Default class for unknown status
    }
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return '';
    }
  }
}
