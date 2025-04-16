import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking, Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent {
  property!: Property;
  allImages: string[] = [];
  isLoading = true;
  error: string | null = null;

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
  onDateRangeSelected(range: { start: Date, end: Date }) {
    const booking: Booking = {
      startDate: range.start.toISOString().split('T')[0],
      endDate: range.end.toISOString().split('T')[0],
      property: this.property.id // Optional, backend may already infer this
    };
  
    this.propertyService.addBooking(this.property.id, booking).subscribe({
      next: (response) => {
        alert('Booking successful! 🏡');
        
        // Refresh calendar or give feedback
      },
      error: (err) => {
        console.error(err);
        alert('Booking failed.');
      }
    });
  }
  
  

}
