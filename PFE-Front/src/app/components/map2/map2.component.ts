import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css']
})
export class Map2Component implements  OnChanges, AfterViewInit {
  @Input() latitude: number | undefined = 0;
  @Input() longitude: number | undefined = 0;
  @Input() propertyTitle: string = '';
  
  private map: L.Map | undefined;
  private resizeObserver: ResizeObserver | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    // Delay map initialization to ensure DOM is ready
    setTimeout(() => {
      this.initializeMap();
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-initialize map if coordinates change
    if ((changes['latitude'] || changes['longitude']) && this.map) {
      this.map.remove();
      this.initializeMap();
    }
  }

  ngOnDestroy(): void {
    // Clean up resources
    if (this.map) {
      this.map.remove();
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initializeMap(): void {
    const lat = this.latitude || 0;
    const lng = this.longitude || 0;
    
    // Make sure container exists
    const container = document.getElementById('map');
    if (!container) {
      console.error('Map container not found');
      return;
    }

    // Fix icon paths for Leaflet
    const iconRetinaUrl = '/assets/marker-icon-2x-red.png';
    const iconUrl = '/assets/marker-icon-red.png';
    const shadowUrl = '/assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    // Create the map
    this.map = L.map('map', {
      center: [lng, lat],
      zoom: 13
    });

    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add marker
    L.marker([lng, lat])
      .addTo(this.map)
      .bindPopup(this.propertyTitle || 'Property Location')
      .openPopup();

    // Use ResizeObserver to handle container size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
    this.resizeObserver.observe(container);
    
    // Force map to recalculate its size
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 500);
  }
}