import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-specification-tab',
  templateUrl: './specification-tab.component.html',
  styleUrls: ['./specification-tab.component.css']
})
export class SpecificationTabComponent implements OnInit {

  @Input() parentForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {}
  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  bedroomOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: 'studio', label: 'Studio' }
  ];

  bathroomOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' }
  ];

  parkingOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' }
  ];
  selectBedroom(value: string): void {
    this.parentForm.get('bedrooms')?.setValue(value);
  }

  selectBathroom(value: string): void {
    this.parentForm.get('bathrooms')?.setValue(value);
  }

  selectParking(value: string): void {
    this.parentForm.get('parkingSpots')?.setValue(value);
  }
  

}
