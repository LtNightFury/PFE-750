import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {

  allProperties: Property[] = [];
  filteredProperties: Property[] = [];

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    // ✅ Fetch properties from the Symfony backend only
    this.propertyService.getAllProperties().subscribe(apiData => {
      this.allProperties = apiData;
      this.filteredProperties = apiData;
    });
  }

onFiltersChanged(filters: any) {
  this.filteredProperties = this.allProperties.filter(prop => {
    const rawPrice = prop.price.price;
    const actualPrice = Number(rawPrice);

    const minPrice = filters.minPrice !== null && filters.minPrice !== undefined ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice !== null && filters.maxPrice !== undefined ? Number(filters.maxPrice) : null;

    console.log(`Checking property price: ${rawPrice} → ${actualPrice} | min: ${minPrice} | max: ${maxPrice}`);

    const matchesDealType = filters.dealType ? prop.generalinfo.deal_type.toLowerCase() === filters.dealType.toLowerCase() : true;
    const matchesType = filters.type ? prop.generalinfo.propertyType === filters.type : true;
    const matchesCity = filters.city ? prop.location.city.toLowerCase().includes(filters.city.toLowerCase()) : true;
    const matchesMinPrice = minPrice !== null ? actualPrice >= minPrice : true;
    const matchesMaxPrice = maxPrice !== null ? actualPrice <= maxPrice : true;
    const matchesSearch = filters.search ? prop.generalinfo.title.toLowerCase().includes(filters.search.toLowerCase()) : true;

    const matched = matchesDealType && matchesType && matchesCity && matchesMinPrice && matchesMaxPrice && matchesSearch;

    if (!matched) {
      console.log(`❌ Not matched: ${prop.generalinfo.title} | Price: ${actualPrice}`);
    }

    return matched;
  });

  console.log('✅ Filtered properties:', this.filteredProperties.length);
}



}
