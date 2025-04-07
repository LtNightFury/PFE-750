import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-tab',
  templateUrl: './location-tab.component.html',
  styleUrls: ['./location-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationTabComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  latitude: number = 0;
  longitude: number = 0;
  selectedPosition: [number, number] | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}
  country={
    
    tunisia: 'Tunisia',
    
  }
  city={
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
  }
  
  
  

  ngOnInit(): void {
  
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onPositionSelected(coordinates: [number, number]) {
    this.selectedPosition = coordinates;
    this.latitude = coordinates[0];
    this.longitude = coordinates[1];
    this.parentForm.get('latitude')?.setValue(this.latitude);
    this.parentForm.get('longitude')?.setValue(this.longitude);
    this.cdr.markForCheck();
  }

  
  cityOptions = Object.entries(this.city).map(([key, label]) => ({
    value: key,
    label: label
  }));
  selectedCity: string | null = null;
  onCitySelected(cityKey: string) {
    this.selectedCity = cityKey;
   
      
    this.parentForm.get('city')?.setValue(cityKey);    
  }
  countryOptions = Object.entries(this.country).map(([key, label]) => ({
    value: key,
    label: label
  }));
  selectedCountry: string | null = null;
  
  onCountrySelected(countryKey: string) {
    this.selectedCountry = countryKey;
    this.parentForm.get('country')?.setValue(countryKey);
  }
  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
     
  }

    
    
  
  

