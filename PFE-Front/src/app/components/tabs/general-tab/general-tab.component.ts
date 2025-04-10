import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.css']
})
export class GeneralTabComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  
 
  

  constructor() {}

  ngOnInit(): void {}

  
  
  
  // Helper method to check if a control is invalid and touched
  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  PropertyCondition= [
    { value: 'new', label: 'New' },
    { value: 'renovated', label: 'Renovated' },
    { value: 'Needs_Renovation', label: 'Needs Renovation' },
  ]

  propertyType = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'studio', label: 'Studio' },
    { value: 'villa', label: 'Villa' }
  ];
  
  selectedPropertyType: string | null = null;
  selectedPropertyCondition: string | null = null;
  
  onPropertyTypeSelected(propertyType: string) {
    this.selectedPropertyType = propertyType;
    this.parentForm.get('propertyType')?.setValue(propertyType);
  }

  onPropertyConditionSelected(propertyCondition: string) {
    this.parentForm.get('PropertyCondition')?.setValue(propertyCondition);
    this.selectedPropertyCondition = propertyCondition;
  }
  
}