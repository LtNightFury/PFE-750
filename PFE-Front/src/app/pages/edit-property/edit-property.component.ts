// edit-property.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  isSubmitting = false;
  submitError: string = '';
  
  // Define tabs
  tabs = [
    { id: 'general', label: 'General' },
    { id: 'location', label: 'Location' },
    { id: 'specification', label: 'Specification' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'price', label: 'Price' },
    { id: 'media', label: 'Media' },
    { id: 'publication', label: 'Publication' },
    { id: 'contacts', label: 'Contacts' }
  ];
  
  activeTab = 'general'; // Default active tab
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Initialize the parent form with groups for each tab
    this.propertyForm = this.fb.group({
      general: this.fb.group({}),
      location: this.fb.group({}),
      specification: this.fb.group({}),
      amenities: this.fb.group({}),
      price: this.fb.group({}),
      media: this.fb.group({}),
      publication: this.fb.group({}),
      contacts: this.fb.group({})
    });
  }
  
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';
      
      // Send data to Symfony backend
      this.http.post('/api/properties', this.propertyForm.value)
        .subscribe(
          response => {
            this.isSubmitting = false;
            console.log('Property saved successfully', response);
          },
          error => {
            this.isSubmitting = false;
            this.submitError = 'There was an error saving the property. Please try again.';
            console.error('Error saving property', error);
          }
        );
    } else {
      this.markFormGroupAsTouched(this.propertyForm);
    }
  }
  markFormGroupAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      }
    });
  }
}