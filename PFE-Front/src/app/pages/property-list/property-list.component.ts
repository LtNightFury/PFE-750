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
    // Fetch properties from the API first
    this.propertyService.getAllProperties().subscribe(apiData => {
      // Update properties from the API if available
      this.allProperties = apiData;
      this.filteredProperties = apiData;

      // Optionally fetch properties from the text file
      this.propertyService.getPropertiesFromTextFile().subscribe(textFileData => {
        // Update properties from text file only if API data is not available or update with new properties
        if (!this.allProperties || this.allProperties.length === 0) {
          this.allProperties = textFileData;
          this.filteredProperties = textFileData;
        }
      });
    });

    // If no API data was fetched, fall back to fetching from the text file
    this.propertyService.getPropertiesFromTextFile().subscribe(textFileData => {
      if (!this.allProperties || this.allProperties.length === 0) {
        this.allProperties = textFileData;
        this.filteredProperties = textFileData;
      }
    });
  }

  onFiltersChanged(filters: any) {
    this.filteredProperties = this.allProperties.filter(prop => {
      const matchesDealType = filters.dealType ? prop.generalinfo.dealType.toLowerCase() === filters.dealType.toLowerCase() : true;
      const matchesType = filters.type ? prop.generalinfo.propertyType === filters.type : true;
      const matchesCity = filters.city ? prop.location.city.toLowerCase().includes(filters.city.toLowerCase()) : true;
      const matchesMinPrice = filters.minPrice ? +prop.price.price >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice ? +prop.price.price <= filters.maxPrice : true;
      const matchesSearch = filters.search ? prop.generalinfo.title.toLowerCase().includes(filters.search.toLowerCase()) : true;
  
      return matchesDealType && matchesType && matchesCity && matchesMinPrice && matchesMaxPrice && matchesSearch;
    });
  }

}
