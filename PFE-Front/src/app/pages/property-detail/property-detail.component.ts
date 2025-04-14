import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/models/property.model';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent {
  property!: Property;
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
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Property not found.';
        this.isLoading = false;
      }
    });
  }

}
