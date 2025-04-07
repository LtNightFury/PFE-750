import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapElement') mapElement!: ElementRef;
 
  
  @Input() accessToken!: string;
  @Input() center: [number, number] = [0, 0]; 
  @Input() zoom: number=0 ;
  @Output() positionSelected = new EventEmitter<[number, number]>();


  marker: mapboxgl.Marker | null = null;
  defaultcenter: [number, number] = [10.1815,36.8065]; // Default center coordinates (Tunis)];
  
 
  
  
  map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    
    this.initializeMap(); 
    if (this.center && this.center[0] !== 0 && this.center[1] !== 0) {
      this.defaultcenter=this.center;
      // Wait for map to load before adding marker
      this.map.on('load', () => {
        this.setMarkerPosition(this.center);
        this.map.flyTo({
          center: this.center,
          zoom: this.zoom || 16,
          essential: true
        });
      });}

   
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  } 
  
  
  

  private initializeMap() {
    (mapboxgl as any).accessToken = this.accessToken;
    
    // Initialize map
    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement,
      style: 'assets/style.json', 
    center: this.defaultcenter,
      zoom: this.zoom,
      pitch: 60, 
      bearing: 0,
     

      
    });

    
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('click', (event) => {
      const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat];
      this.placeMarker(coordinates);
      this.positionSelected.emit(coordinates);
    });
  }
  
  private placeMarker(coordinates: [number, number]) {
    // Remove existing marker if there is one
    if (this.marker) {
      this.marker.remove();
    }
    
    // Create and add a new marker
    this.marker = new mapboxgl.Marker({
      draggable: true,
      color: '#FF0000'
    })
      .setLngLat(coordinates)
      .addTo(this.map);
    
    // Add drag end event to update position when marker is dragged
    this.marker.on('dragend', () => {
      const position = this.marker!.getLngLat();
      this.positionSelected.emit([position.lng, position.lat]);
    });
  }
  
  // Public method to set marker programmatically
  public setMarkerPosition(coordinates: [number, number]) {
    this.placeMarker(coordinates);
    
  }
}
