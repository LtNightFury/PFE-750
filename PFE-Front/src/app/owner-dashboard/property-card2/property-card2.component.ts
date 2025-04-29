import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-property-card2',
  templateUrl: './property-card2.component.html',
  styleUrls: ['./property-card2.component.css']
})
export class PropertyCard2Component {
  @Input() property!: Property;
  
  // Cached computed properties
  propertyStatus: string = '';
  isOffMarket: boolean = false;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Determine property status
    this.propertyStatus = this.determinePropertyStatus();
    this.isOffMarket = this.checkIfOffMarket();
  }
  
  determinePropertyStatus(): string {
    // You can customize this logic based on your business rules
    return this.property?.generalinfo?.PropertyCondition || 'Active';
  }
  
  checkIfOffMarket(): boolean {
    // Define your off-market logic here
    return this.property?.generalinfo?.PropertyCondition === 'Off Market';
  }
  
  navigateToDetail(): void {
    this.router.navigate(['/properties', this.property.id]);
  }
  
  getPropertyImage(): string {
    if (this.property?.Media?.photos?.length > 0) {
      return 'http://backend.ddev.site' + this.property.Media.photos[0].imageName;
    }
    return '/assets/default-property.jpg'; // Fallback image
  }
}
