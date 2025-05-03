import { Component } from '@angular/core';
import { PropertyView } from '../../models/property-view.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-views',
  templateUrl: './property-views.component.html',
  styleUrls: ['./property-views.component.css']
})
export class PropertyViewsComponent {
  views: PropertyView[] = [];
  isLoading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.propertyService.getUserViews().subscribe({
      next: (response) => {
        const views = response?.views ?? [];
  
        // Sort by viewedAt descending (latest first)
        this.views = views.sort((a, b) => {
          return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime();
        });
  
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed to load property views');
      }
    });
  }
  

  getImageUrl(path: string): string {
    if (!path) return '/assets/default.jpg';
    return path.startsWith('http')
      ? path
      : `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }
}
