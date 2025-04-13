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
    this.propertyService.getAllProperties().subscribe(data => {
      this.allProperties = data;
      this.filteredProperties = data;
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