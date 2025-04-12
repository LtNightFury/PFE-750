import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-property-filter',
  templateUrl: './property-filter.component.html',
  styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  type: string = '';
  city: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  search: string = '';

  // Called when filters change
  applyFilters() {
    const filters = {
      type: this.type,
      city: this.city,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      search: this.search
    };
    this.filterChanged.emit(filters);
  }

  resetFilters() {
    this.type = '';
    this.city = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.search = '';
    this.applyFilters(); // Emit empty filters
  }

}
