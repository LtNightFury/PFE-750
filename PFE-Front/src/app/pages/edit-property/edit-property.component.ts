import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
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
  propertyId!: number;
  isEditMode = false; 
  pageTitle = 'Create Property';
  
  
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
    private fb: FormBuilder,
    private router: Router
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

  // 3. Check if we're in edit mode and load property data
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    
    if (id && id !== 'new') {
      // Edit mode
      this.isEditMode = true;
      this.pageTitle = 'Edit Property';
      this.propertyId = Number(id);
      
      this.propertyService.getPropertyById(this.propertyId).subscribe(
        property => {
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
          });
        },
        error => {
          console.error('Error loading property:', error);
          this.submitError = 'Failed to load property data';
        }
      );
    } else {
      // Create mode
      this.isEditMode = false;
      this.pageTitle = 'Create Property';
    }
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

    // Copy all form data except media
    const nonMediaData = { ...this.propertyForm.value };
    delete nonMediaData.media;

    // Append the form data as a JSON string
    formData.append('data', JSON.stringify(nonMediaData));

    // If in edit mode, add the _method=PUT override
    if (this.isEditMode) {
      formData.append('_method', 'PUT');
    }

    // Append media files
    const mediaGroup = this.propertyForm.get('media') as FormGroup;

    // Photos
    const photosArray = mediaGroup.get('photos') as FormArray;
    if (photosArray && photosArray.length > 0) {
      photosArray.controls.forEach((control: any, index: number) => {
        if (control.value && control.value.file) {
          formData.append(`photos[${index}]`, control.value.file);
        }
      });
    }

    // Floor Plans
    const floorPlansArray = mediaGroup.get('floorPlans') as FormArray;
    if (floorPlansArray && floorPlansArray.length > 0) {
      floorPlansArray.controls.forEach((control: any, index: number) => {
        if (control.value && control.value.file) {
          formData.append(`floorPlans[${index}]`, control.value.file);
        }
      });
    }

    // Documents
    const documentsArray = mediaGroup.get('documents') as FormArray;
    if (documentsArray && documentsArray.length > 0) {
      documentsArray.controls.forEach((control: any, index: number) => {
        if (control.value && control.value.file) {
          formData.append(`documents[${index}]`, control.value.file);
        }
      });
    }

    // Videos (if you handle videos similarly)
    const videosArray = mediaGroup.get('videos') as FormArray;
    if (videosArray && videosArray.length > 0) {
      videosArray.controls.forEach((control: any, index: number) => {
        if (control.value && control.value.file) {
          formData.append(`videos[${index}]`, control.value.file);
        }
      });
    }

    // Virtual Tours (if you handle these)
    const virtualToursArray = mediaGroup.get('virtualTours') as FormArray;
    if (virtualToursArray && virtualToursArray.length > 0) {
      virtualToursArray.controls.forEach((control: any, index: number) => {
        if (control.value && control.value.file) {
          formData.append(`virtualTours[${index}]`, control.value.file);
        }
      });
    }

    // Choose request based on mode
    let request;
    if (this.isEditMode) {
      // POST with _method=PUT for update
      request = this.http.post(`http://backend.ddev.site/api/properties/${this.propertyId}`, formData);
    } else {
      // Regular POST for create
      request = this.http.post('http://backend.ddev.site/api/properties', formData);
    }

    request.subscribe(
      response => {
        this.isSubmitting = false;
        console.log(`Property ${this.isEditMode ? 'updated' : 'created'} successfully`, response);

        // Redirect to list or wherever you want
        this.router.navigate(['/owner']);
      },
      error => {
        this.isSubmitting = false;
        this.submitError = `There was an error ${this.isEditMode ? 'updating' : 'creating'} the property. Please try again.`;
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} property`, error);
      }
    );
  } else {
    this.markFormGroupAsTouched(this.propertyForm);
    console.log('Form is invalid:', this.propertyForm.errors);
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
  onCancel() {
    // Navigate back to the properties list without saving
    this.router.navigate(['/owner']);
  }

}