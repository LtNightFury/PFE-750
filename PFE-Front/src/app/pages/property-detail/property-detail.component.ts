import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  property: any = {};
  isLoading: boolean = true;
  error: string | null = null;
  allImages: string[] = [];
  selectedImageIndex: number = 0;
  showFullGallery: boolean = false;
  showEmailModal: boolean = false;
  showAppointmentForm: boolean = false;
  showAllAmenities: boolean = false;
  appointmentSuccess: boolean = false;
  scheduledAppointment: any = null;
  selectedDateRange: any = {
    startDate: null,
    endDate: null
  };

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    
  ) { }

  ngOnInit(): void {
   this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.loadPropertyDetails(id);
      this.recordPropertyView(+id); // <-- record view here
    } else {
      this.error = 'Property ID not found';
      this.isLoading = false;
    }
  });
  }

  loadPropertyDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    // Load property details
    this.propertyService.getPropertyById(parseInt(id)).subscribe({
      next: (data) => {
        this.property = data;
        this.loadPropertyImages(id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load property details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading property:', err);
      }
    });
  }
  loadPropertyImages(propertyId: string): void {
    // Assuming that your API returns an array of images. Modify as necessary.
    this.propertyService.getPropertyById(parseInt(propertyId)).subscribe({
      next: (data) => {
        if (data.Media && data.Media.photos) {
          this.allImages = data.Media.photos.map(photo => 'http://backend.ddev.site' + photo.imageName);
        }
      },
      error: (err) => {
        console.error('Error loading images:', err);
      }
    });
  }
  // Gallery methods
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  prevImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.allImages.length) % this.allImages.length;
  }

  nextImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.allImages.length;
  }

  openFullGallery(): void {
    this.showFullGallery = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
  }

  closeFullGallery(): void {
    this.showFullGallery = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Amenities handling
  hasMoreAmenities(): boolean {
    const amenitiesCount = Object.values(this.property.Amenities || {}).filter(value => value === true).length;
    return amenitiesCount > 12;
  }

  toggleAllAmenities(): void {
    this.showAllAmenities = !this.showAllAmenities;
  }

  // Contact agent methods
  openEmailModal(): void {
    this.showEmailModal = true;
  }

  closeEmailModal(): void {
    this.showEmailModal = false;
  }

  onEmailSent(result: any): void {
    this.closeEmailModal();
    // Success handling here
  }

  callAgent(): void {
    if (this.property && this.property.user && this.property.user.phoneNumber) {
      window.location.href = `tel:${this.property.user.phoneNumber}`;
    } else {
      alert('Phone number not available');
    }
  }

  // Appointment methods
  openAppointmentForm(): void {
    this.showAppointmentForm = true;
  }

  closeAppointmentForm(): void {
    this.showAppointmentForm = false;
  }

  onAppointmentScheduled(appointment: any): void {
    this.closeAppointmentForm();
    this.appointmentSuccess = true;
    this.scheduledAppointment = appointment;
    
    // Auto-hide the success message after 5 seconds
    setTimeout(() => {
      this.appointmentSuccess = false;
    }, 5000);
  }

  // Date range selection for rentals
  onDateRangeChange(dateRange: any): void {
    this.selectedDateRange = dateRange;
  }

  submitBooking(): void {
    if (!this.selectedDateRange.startDate || !this.selectedDateRange.endDate) {
      return;
    }
    
    const bookingData = {
      propertyId: this.property.id,
      startDate: this.selectedDateRange.startDate,
      endDate: this.selectedDateRange.endDate,
      popertyTitle: this.property.title || '',
      propertyCity: this.property.city || '',
      propertysubcity: this.property.subcity || ''
    };
    
    this.propertyService.addBooking(this.property.id, bookingData).subscribe({
      next: (response) => {
        alert('Booking successful!');
      },
      error: (err) => {
        console.error('Booking error:', err);
        alert('Failed to book. Please try again.');
      }
    });
  }
  getImageUrl(path: string): string {
    if (!path) return '/assets/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }

  reload(): void {
    if (this.property && this.property.id) {
      this.loadPropertyDetails(this.property.id);
    } else {
      window.location.reload();
    }
  }
  recordPropertyView(propertyId: number): void {
  this.propertyService.recordView(propertyId).subscribe({
    next: () => {
      console.log('View recorded');
    },
    error: (err) => {
      console.error('Failed to record view:', err);
    }
  });
}

}
