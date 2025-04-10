import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-tab',
  templateUrl: './location-tab.component.html',
  styleUrls: ['./location-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationTabComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  latitude: number = 0;
  longitude: number = 0;
  selectedPosition: [number, number] | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  country = {
    tunisia: 'Tunisia',
  };

  city = {
    ariana: 'Ariana',
    beja: 'Béja',
    ben_arous: 'Ben Arous',
    bizerte: 'Bizerte',
    gabes: 'Gabès',
    gafsa: 'Gafsa',
    jendouba: 'Jendouba',
    kairouan: 'Kairouan',
    kasserine: 'Kasserine',
    kebili: 'Kebili',
    la_manouba: 'La Manouba',
    le_kef: 'Le Kef',
    mahdia: 'Mahdia',
    medenine: 'Médenine',
    monastir: 'Monastir',
    nabeul: 'Nabeul',
    sfax: 'Sfax',
    sidi_bouzid: 'Sidi Bouzid',
    siliana: 'Siliana',
    sousse: 'Sousse',
    tataouine: 'Tataouine',
    tozeur: 'Tozeur',
    tunis: 'Tunis',
    zaghouan: 'Zaghouan'
  };

  cityOptions = Object.entries(this.city).map(([key, label]) => ({
    value: key,
    label: label
  }));

  countryOptions = Object.entries(this.country).map(([key, label]) => ({
    value: key,
    label: label
  }));

  selectedCity: string | null = null;
  selectedCountry: string | null = null;

  ngOnInit(): void {
    // Initialize values from the parent form
    this.initializeFormValues();
    
    // Subscribe to form control changes
    this.subscribeToFormChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeFormValues(): void {
    // Get initial values from parent form
    this.latitude = this.parentForm.get('latitude')?.value || 0;
    this.longitude = this.parentForm.get('longitude')?.value || 0;
    this.selectedCountry = this.parentForm.get('country')?.value || null;
    this.selectedCity = this.parentForm.get('city')?.value || null;
    
    // Mark for change detection
    this.cdr.markForCheck();
  }

  private subscribeToFormChanges(): void {
    // Subscribe to country changes
    const countrySub = this.parentForm.get('country')?.valueChanges.subscribe(value => {
      this.selectedCountry = value;
      this.cdr.markForCheck();
    });
    
    if (countrySub) {
      this.subscriptions.push(countrySub);
    }

    // Subscribe to city changes
    const citySub = this.parentForm.get('city')?.valueChanges.subscribe(value => {
      this.selectedCity = value;
      this.cdr.markForCheck();
    });
    
    if (citySub) {
      this.subscriptions.push(citySub);
    }

    // Subscribe to latitude changes
    const latSub = this.parentForm.get('latitude')?.valueChanges.subscribe(value => {
      this.latitude = value || 0;
      this.cdr.markForCheck();
    });
    
    if (latSub) {
      this.subscriptions.push(latSub);
    }

    // Subscribe to longitude changes
    const lngSub = this.parentForm.get('longitude')?.valueChanges.subscribe(value => {
      this.longitude = value || 0;
      this.cdr.markForCheck();
    });
    
    if (lngSub) {
      this.subscriptions.push(lngSub);
    }
  }

  onPositionSelected(coordinates: [number, number]) {
    this.selectedPosition = coordinates;
    this.latitude = coordinates[0];
    this.longitude = coordinates[1];
    this.parentForm.get('latitude')?.setValue(this.latitude);
    this.parentForm.get('longitude')?.setValue(this.longitude);
    this.cdr.markForCheck();
  }

  onCitySelected(cityKey: string) {
    this.selectedCity = cityKey;
    this.parentForm.get('city')?.setValue(cityKey);
    this.cdr.markForCheck();
  }
  
  onCountrySelected(countryKey: string) {
    this.selectedCountry = countryKey;
    this.parentForm.get('country')?.setValue(countryKey);
    this.cdr.markForCheck();
  }

  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}