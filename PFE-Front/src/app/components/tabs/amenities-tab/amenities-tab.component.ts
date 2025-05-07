import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-amenities-tab',
  templateUrl: './amenities-tab.component.html',
  styleUrls: ['./amenities-tab.component.css']
})
export class AmenitiesTabComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() amenitiesData: any;
  amenitiesForm!: FormGroup;
  selectedAction: { [key: string]: string } = {};
  
  // Define the sections and amenities as in the image
  buildingAmenities = [
    { id: 'centralAC', name: 'Central A/C & Heating' },
    { id: 'parking', name: 'Parking' },
    { id: 'elevator', name: 'Elevator' },
    { id: 'petsAllowed', name: 'Pets Allowed' }
  ];

  serviceAmenities = [
    { id: 'conciergeService', name: 'Concierge Service' },
    { id: 'maidService', name: 'Maid Service' },
    { id: 'securityService', name: 'Security Service' },
    { id: 'lobbyInBuilding', name: 'Lobby in Building' }
  ];
  
  roomAmenities = [
    { id: 'maidsRoom', name: 'Maids Room' },
    { id: 'studyRoom', name: 'Study Room' },
    { id: 'balcony', name: 'Balcony' },
    { id: 'walkInCloset', name: 'Walk-In Closet' }
  ];
  
  areaAmenities = [
    { id: 'childrensPlayArea', name: 'Children\'s Play Area' },
    { id: 'garden', name: 'Garden' },
    { id: 'barbecueArea', name: 'Barbecue Area' },
  ];
  
  wellnessAmenities = [
    { id: 'jacuzzi', name: 'Jacuzzi' },
    { id: 'sauna', name: 'Sauna' },
    { id: 'sharedGym', name: 'Shared Gym' },
    { id: 'privateGym', name: 'Private Gym' },
    { id: 'sharedPool', name: 'Shared Pool' },
    { id: 'privatePool', name: 'Private Pool' },
    { id: 'spa', name: 'Spa' },
  ];
  
  nearbyAmenities = [
    { id: 'viewOfWater', name: 'View of Water' },
    { id: 'viewOfLandmark', name: 'View of Landmark' },
    { id: 'nearbyHospitals', name: 'Nearby Hospitals' },
    { id: 'nearbyPublicTransport', name: 'Nearby Public Transport' },
    { id: 'nearbySchools', name: 'Nearby Schools' },
    { id: 'nearbyShopping', name: 'Nearby Shopping' },
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();

  if (this.amenitiesData) {
    this.amenitiesForm.patchValue(this.amenitiesData);
    Object.keys(this.amenitiesData).forEach(key => {
      this.selectedAction[key] = this.amenitiesData[key] ? 'check' : 'delete';
    });
  } else {
    this.setDefaultSelectedActions();
  }

  if (this.parentForm) {
    this.parentForm.addControl('amenities', this.amenitiesForm);
  }
  }
  
  initForm(): void {
    const formGroupConfig = {};
    
    // Add all amenities to form group
    [
      ...this.buildingAmenities, 
      ...this.serviceAmenities, 
      ...this.roomAmenities,
      ...this.areaAmenities,
      ...this.wellnessAmenities,
      ...this.nearbyAmenities
    ].forEach(amenity => {
      (formGroupConfig as Record<string, boolean[]>)[amenity.id] = [false];
    });
    
    this.amenitiesForm = this.fb.group(formGroupConfig);
  }
  
  toggleAmenity(amenityId: string, action: string): void {
    const control = this.amenitiesForm.get(amenityId);

    if (control) {
      // Update the selected action
      if (action === 'check') {
        this.selectedAction[amenityId] = 'check';
        control.setValue(true); // Set the form control value to true
      } else if (action === 'delete') {
        this.selectedAction[amenityId] = 'delete';
        control.setValue(false); // Set the form control value to false
      }
    }
  }
  
  isSelected(amenityId: string, action: string): boolean {
    return this.selectedAction[amenityId] === action;
  }

  setDefaultSelectedActions(): void {
    [
      ...this.buildingAmenities, 
      ...this.serviceAmenities, 
      ...this.roomAmenities,
      ...this.areaAmenities,
      ...this.wellnessAmenities,
      ...this.nearbyAmenities
    ].forEach(amenity => {
      this.selectedAction[amenity.id] = 'delete'; // Default selection is delete
    });
  }
}