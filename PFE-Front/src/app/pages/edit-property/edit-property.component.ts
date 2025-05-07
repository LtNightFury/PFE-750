import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/services/property.service';
import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  isSubmitting = false;
  submitError: string = '';
  property!: Property;
  
  
  // Define tabs
  tabs = [
    { id: 'general', label: 'General' },
    { id: 'location', label: 'Location' },
    { id: 'specification', label: 'Specification' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'price', label: 'Price' },
    { id: 'media', label: 'Media' },
    
    { id: 'contacts', label: 'Contacts' }
  ];
  
  activeTab = 'general'; // Default active tab
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // 1. Initialize the form first
    this.propertyForm = this.fb.group({
      general: this.fb.group({
        deal_type: ['sale', Validators.required],
        title: ['', Validators.required],
        description: ['', Validators.required],
        PropertyCondition: ['', Validators.required],
        propertyType: ['', Validators.required],
        availabilityDate: [],
        frequency: [],
        cheques: []
      }),
      location: this.fb.group({
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        country: ['', Validators.required],
        state: ['', Validators.required],
        subcity: ['', Validators.required],
      }),
      specification: this.fb.group({
        bedrooms: [null, Validators.required],
        bathrooms: [null, Validators.required],
        parkingSpots: [null, Validators.required],
        size: [],
        plotSize: [],
        builtUpArea: [],
        constructionYear: [],
        Renovationyear: [],
        Furnishing: []
      }),
      amenities: this.fb.group({}),
      price: this.fb.group({
        price: [null, Validators.required],
        priceunit: [''],
        pricesqft: [],
        originalprice: [],
        hideprice: [false],
        charges: [],
        servicecharge: [],
      }),
      media: this.fb.group({
        photos: this.fb.array([]),
        floorPlans: this.fb.array([]),
        documents: this.fb.array([]),
        videos: this.fb.array([]),
        virtualTours: this.fb.array([])
      }),
      contacts: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: [null, Validators.required],
      })
    });
  
    // 2. Add conditional validation
    this.setConditionalValidation();
  
    // 3. Fetch the property and patch the form
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.propertyService.getPropertyById(id).subscribe(property => {
        this.property = property;
        this.propertyForm.patchValue({
          general: this.property.generalinfo,
          location: {
            latitude: this.property.location.latitude,
            longitude: this.property.location.longitude,
            country: this.property.location.country,
            state: this.property.location.city,
            subcity: this.property.location.subcity
          },
          specification: this.property.Specification,
          price: this.property.price,
          amenities: this.property.Amenities,
          contacts: this.property.contacts,
          media: {
            photos: this.property.Media.photos,
            floorPlans: this.property.Media.floorPlans,
            documents: this.property.Media.documents,
            videos: [],
            virtualTours: []
          }
        }); // ✅ Now this is safe
      });
    });
  }
  
  get generalGroup(): FormGroup {
    return this.propertyForm.get('general') as FormGroup;
  }
  
  get locationGroup(): FormGroup {
    return this.propertyForm.get('location') as FormGroup;
  }
  
  get specificationGroup(): FormGroup {
    return this.propertyForm.get('specification') as FormGroup;
  }
  
  get amenitiesGroup(): FormGroup {
    return this.propertyForm.get('amenities') as FormGroup;
  }
  
  get priceGroup(): FormGroup {
    return this.propertyForm.get('price') as FormGroup;
  }
  
  get mediaGroup(): FormGroup {
    return this.propertyForm.get('media') as FormGroup;
  }
  
 
  
  get contactsGroup(): FormGroup {
    return this.propertyForm.get('contacts') as FormGroup;
  }
  
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';
      const formData = new FormData();
      const nonMediaData = { ...this.propertyForm.value };
      delete nonMediaData.media;
      formData.append('data', JSON.stringify(nonMediaData));
      console.log('Non-media data:', nonMediaData);

      // Append media files to FormData
      const mediaGroup = this.propertyForm.get('media') as FormGroup;
      (mediaGroup.get('photos') as FormArray).controls.forEach((control: any, index: number) => {
        formData.append(`photos[${index}]`, control.value.file);
      });
      (mediaGroup.get('floorPlans') as FormArray).controls.forEach((control: any, index: number) => {
        formData.append(`floorPlans[${index}]`, control.value.file);
      });
      (mediaGroup.get('documents') as FormArray).controls.forEach((control: any, index: number) => {
        formData.append(`documents[${index}]`, control.value.file);
      });
      
      
      for (const [key, value] of (formData as any).entries()) {
        console.log(key, value);
      }
      // Send data to Symfony backend
      this.http.post('http://backend.ddev.site/api/properties', formData)
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
  isInvalid(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  setConditionalValidation() {
    const generalGroup = this.generalGroup;
    const dealTypeControl = generalGroup.get('deal_type');
    
    dealTypeControl?.valueChanges.subscribe(dealType => {
      const availabilityDateControl = generalGroup.get('availabilityDate');
      const frequencyControl = generalGroup.get('frequency');
      const chequesControl = generalGroup.get('cheques');
      
      if (dealType === 'rent') {
        availabilityDateControl?.setValidators([Validators.required]);
        frequencyControl?.setValidators([Validators.required]);
        chequesControl?.setValidators([Validators.required]);
      } else {
        availabilityDateControl?.clearValidators();
        frequencyControl?.clearValidators();
        chequesControl?.clearValidators();
      }
      
      availabilityDateControl?.updateValueAndValidity();
      frequencyControl?.updateValueAndValidity();
      chequesControl?.updateValueAndValidity();
    });
  }

}