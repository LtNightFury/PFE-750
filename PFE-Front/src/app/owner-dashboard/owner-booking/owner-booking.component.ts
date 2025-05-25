import { Component } from '@angular/core';
import { PropertyService } from 'src/app/services/property.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-owner-booking',
  templateUrl: './owner-booking.component.html',
  styleUrls: ['./owner-booking.component.css']
})
export class OwnerBookingComponent {
bookings: any[] = [];

  constructor(private propertyservice: PropertyService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.propertyservice.getownerBookings().subscribe(data => {
      this.bookings = data;
    });
  }

 approve(id: number): void {
  Swal.fire({
    title: 'Approve Booking?',
    text: 'Are you sure you want to approve this booking?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.propertyservice.approveBooking(id).subscribe(() => {
        this.loadBookings();
        Swal.fire('Approved!', 'The booking has been approved.', 'success');
      });
    }
  });
}

reject(id: number): void {
  Swal.fire({
    title: 'Reject Booking?',
    text: 'Are you sure you want to reject this booking?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.propertyservice.rejectBooking(id).subscribe(() => {
        this.loadBookings();
        Swal.fire('Rejected!', 'The booking has been rejected.', 'success');
      });
    }
  });
}
}
