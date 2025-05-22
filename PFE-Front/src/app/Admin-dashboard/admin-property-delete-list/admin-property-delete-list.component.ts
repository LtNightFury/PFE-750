import { Component } from '@angular/core';
import { PropertyService } from 'src/app/services/property.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-property-delete-list',
  templateUrl: './admin-property-delete-list.component.html',
  styleUrls: ['./admin-property-delete-list.component.css']
})
export class AdminPropertyDeleteListComponent {
properties: any[] = [];
  filteredProperties: any[] = [];
  searchTerm = '';
  selectedProperty: any = null;

  constructor(
    private propertyService: PropertyService, 
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getAllProperties().subscribe({
      next: (data: any[]) => {
        this.properties = data;
        this.filteredProperties = [...data];
      },
      error: (err) => {
        console.error('Failed to load properties', err);
      },
    });
  }

  filterProperties() {
    this.filteredProperties = this.properties.filter(p =>
      p.generalinfo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openConfirmModal(property: any) {
    this.selectedProperty = property;
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  AdminDeleteProperty() {
    if (!this.selectedProperty) return;

    // Use the service method instead of direct HTTP call
    this.propertyService.AdminDeleteProperty(this.selectedProperty.id).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== this.selectedProperty.id);
        this.filterProperties();
        const modalElement = document.getElementById('confirmModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      },
      error: (err) => {
        console.error('Deletion failed', err);
      },
    });
  }
}
