import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-property-filter',
  templateUrl: './property-filter.component.html',
  styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  // Keep the original filter structure to match your component logic
  type: string = '';
  city: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  search: string = '';
  dealType: string = '';


  // Visual representations for the UI
  lookingFor: string = 'Residence in Tunis';
  selectedLocation: string = 'Tunis';
  priceRangeDisplay: string = '10000 - 50000 TND';
  
  // Options for dropdowns
  dealTypes: string[] = ['Rent', 'Sale'];
  propertyTypes: string[] = ['Apartment', 'House', 'Villa', 'Commercial', 'Studio'];
  locations: string[] = ['Ariana',
  'Beja',
  'Ben Arous',
  'Bizerte',
  'Gabes',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kebili',
  'Kef',
  'Mahdia',
  'Manouba',
  'Medenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan'];
  priceRanges: { display: string, min: number, max: number | null }[] = [
    { display: '10000 - 50000 TND', min: 10000, max: 50000 },
    { display: '50000 - 100000 TND', min: 50000, max: 100000 },
    { display: '100000 - 250000 TND', min: 100000, max: 250000 },
    { display: '250000 - 500000 TND', min: 250000, max: 500000 },
    { display: '500000+', min: 500000, max: null }
  ];

  /**
   * Update the property type filter
   */
  onTypeChange(newType: string) {
    this.type = newType;
    this.updateLookingForText();
    this.applyFilters();
  }

  /**
   * Update the city filter when location changes
   */
  onLocationChange(location: string) {
    this.selectedLocation = location;
    
    // Set the city filter based on location
    // In a real app, you might want more sophisticated logic here
    if (location === 'Tunis') {
      this.city = 'Tunis';
    } else {
      this.city = location;
    }
    
    this.updateLookingForText();
    this.applyFilters();
  }

  /**
   * Update price range filters
   */
  onPriceRangeChange(rangeDisplay: string) {
    this.priceRangeDisplay = rangeDisplay;
    
    // Find the selected price range and set min/max
    const selectedRange = this.priceRanges.find(range => range.display === rangeDisplay);
    if (selectedRange) {
      this.minPrice = selectedRange.min;
      this.maxPrice = selectedRange.max;
    }
    
    this.applyFilters();
  }

  /**
   * Update the search filter
   */
  onSearchChange(query: string) {
    this.search = query;
    this.applyFilters();
  }

  /**
   * Update the "Looking For" text based on current filters
   */
  private updateLookingForText() {
    const typeText = this.type || 'Residence';
    const locationText = this.city || this.selectedLocation;
    this.lookingFor = `${typeText} in ${locationText}`;
  }

  /**
   * Apply all filters and emit the event
   */
  applyFilters() {
    const filters = {
      dealType: this.dealType,
      type: this.type,
      city: this.city,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      search: this.search
    };
    
    this.filterChanged.emit(filters);
  }

  /**
   * Reset all filters to default values
   */
  resetFilters() {
    this.type = '';
    this.city = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.search = '';
    
    // Reset UI elements
    this.lookingFor = 'Residence in Yogyakarta';
    this.selectedLocation = 'Indonesia';
    this.priceRangeDisplay = '$10000 - $50000';
    
    this.applyFilters();
  }
}