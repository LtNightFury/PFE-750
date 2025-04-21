import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking, Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';
import { DateRangePickerComponent } from 'src/app/components/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  @ViewChild(DateRangePickerComponent)
  dateRangePicker!: DateRangePickerComponent;
  
  property!: Property;
  allImages: string[] = [];
  isLoading = true;
  error: string | null = null;
  bookings: { startDate: Date; endDate: Date }[] = [];
  selectedImageIndex = 0;
showFullGallery = false;
  
  // Store selected dates
  selectedDateRange: { startDate: Date | null; endDate: Date | null } = {
    startDate: null,
    endDate: null
  };

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.propertyService.getPropertyById(id).subscribe({
      next: (data) => {
        this.property = data;

        // Combine photos, floorPlans, and documents into a single array
        const baseUrl = 'http://backend.ddev.site';
        const photos = data.Media.photos.map(p => baseUrl + p.imageName);
        const floorPlans = data.Media.floorPlans.map(p => baseUrl + p.imageName);
        
        this.allImages = [...photos, ...floorPlans]; // Combine all images
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Property not found.';
        this.isLoading = false;
      }
    });
  }

  // Update to just store the date range
  onDateRangeChange(range: { startDate: Date | null; endDate: Date | null }): void {
    this.selectedDateRange = range;
  }

  // Method to handle form submission with all data
  submitBooking(): void {
    // Validate that we have a complete date range
    if (!this.selectedDateRange.startDate || !this.selectedDateRange.endDate) {
      console.error('Please select a complete date range');
      return;
    }

    // Format dates for API request
    const booking: Booking = {
      startDate: this.selectedDateRange.startDate.toISOString(),
      endDate: this.selectedDateRange.endDate.toISOString(),
      property: this.property.id
      // Add any other data you need here
    };

    // Call the service to add the booking
    this.propertyService.addBooking(this.property.id, booking).subscribe({
      next: (response) => {
        // Add the new booking to the local list
        this.property.bookings.push(response);
        console.log('Booking successful!', response);
        
        // Reset the selected range
        this.selectedDateRange = { startDate: null, endDate: null };
        
        // You might want to show a success message
      },
      error: (error) => {
        console.error('Booking failed', error);
        // Show error message
      }
    });




  }

//el gallary lena 
selectImage(index: number): void {
  this.selectedImageIndex = index;
}

openFullGallery(): void {
  this.showFullGallery = true;
}

closeFullGallery(): void {
  this.showFullGallery = false;
}

nextImage(): void {
  this.selectedImageIndex = (this.selectedImageIndex + 1) % this.allImages.length;
}

prevImage(): void {
  this.selectedImageIndex = (this.selectedImageIndex - 1 + this.allImages.length) % this.allImages.length;
}





}