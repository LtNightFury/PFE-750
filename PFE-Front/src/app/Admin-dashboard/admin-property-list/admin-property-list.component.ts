import { Component } from '@angular/core';
import { Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-admin-property-list',
  templateUrl: './admin-property-list.component.html',
  styleUrls: ['./admin-property-list.component.css']
})
export class AdminPropertyListComponent {
 properties: Property[] = [];
  filteredProperties: Property[] = [];
  searchTerm = '';
p: number = 1;
  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getAdminProperties().subscribe(data => {
      this.properties = data;
      this.filteredProperties = data;
    });
  }

  filterProperties() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProperties = this.properties.filter(p =>
      p.generalinfo.title.toLowerCase().includes(term)
    );
  }

  confirmAction(property: Property, decision: 'approved' | 'rejected') {
    if (confirm(`Are you sure you want to ${decision} this property?`)) {
      this.propertyService.updatePropertyApproval(property.id, decision).subscribe(() => {
        this.loadProperties();
      });
    }
  }
  getTrueAmenities(amenities: any): string[] {
  return Object.entries(amenities)
    .filter(([_, value]) => value === true)
    .map(([key]) =>
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
    );
}
}
