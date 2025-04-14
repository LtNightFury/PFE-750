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

  state = {
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
  subcities: { [key: string]: string[] } = {
    ariana: ['Ariana Ville', 'La Soukra', 'Raoued', 'Ettadhamen', 'Kalaat el-Andalous'],
    beja: ['Béja Nord', 'Béja Sud', 'Testour', 'Nefza', 'Téboursouk'],
    ben_arous: ['Ben Arous', 'Rades', 'Hammam Lif', 'Ezzahra', 'Mégrine'],
    bizerte: ['Bizerte Nord', 'Bizerte Sud', 'Menzel Bourguiba', 'Ras Jebel', 'Mateur'],
    gabes: ['Gabès Ville', 'Gabès Sud', 'El Hamma', 'Matmata', 'Mareth'],
    gafsa: ['Gafsa Nord', 'Gafsa Sud', 'El Ksar', 'Métlaoui', 'Redeyef'],
    jendouba: ['Jendouba Nord', 'Jendouba Sud', 'Ghardimaou', 'Tabarka', 'Fernana'],
    kairouan: ['Kairouan Nord', 'Kairouan Sud', 'Chebika', 'Sbikha', 'Haffouz'],
    kasserine: ['Kasserine Nord', 'Kasserine Sud', 'Sbeitla', 'Feriana', 'Fériana'],
    kebili: ['Kebili Nord', 'Kebili Sud', 'Douz', 'Souk Lahad'],
    la_manouba: ['Manouba', 'Denden', 'Oued Ellil', 'Douar Hicher', 'Tebourba'],
    le_kef: ['Le Kef Est', 'Le Kef Ouest', 'Nebeur', 'Tajerouine', 'Kalaat Senan'],
    mahdia: ['Mahdia Ville', 'Ksour Essef', 'El Jem', 'Chebba', 'Bou Merdes'],
    medenine: ['Medenine Nord', 'Medenine Sud', 'Houmt Souk', 'Midoun', 'Ben Gardane'],
    monastir: ['Monastir Ville', 'Ksar Hellal', 'Sahline', 'Jemmel', 'Bekalta'],
    nabeul: ['Nabeul Ville', 'Hammamet', 'Dar Chaabane', 'Korba', 'Kelibia'],
    sfax: ['Sfax Ville', 'Sakiet Ezzit', 'Sakiet Eddaier', 'Thyna', 'El Ain'],
    sidi_bouzid: ['Sidi Bouzid Est', 'Sidi Bouzid Ouest', 'Menzel Bouzaiene', 'Regueb', 'Jilma'],
    siliana: ['Siliana Nord', 'Siliana Sud', 'Kesra', 'Makthar', 'Bourouis'],
    sousse: ['Sousse Ville', 'Kalaa Kebira', 'Hammam Sousse', 'Msaken', 'Sidi Bou Ali'],
    tataouine: ['Tataouine Nord', 'Tataouine Sud', 'Ghomrassen', 'Smar', 'Bir Lahmar'],
    tozeur: ['Tozeur Ville', 'Nefta', 'Degache', 'Tameghza'],
    tunis: ['Tunis Centre', 'La Marsa', 'Le Bardo', 'El Menzah', 'Carthage'],
    zaghouan: ['Zaghouan Ville', 'Zriba', 'Nadhour', 'El Fahs', 'Bir Mcherga']
  };

  stateOptions = Object.entries(this.state).map(([key, label]) => ({
    value: key,
    label: label
  }));

  countryOptions = Object.entries(this.country).map(([key, label]) => ({
    value: key,
    label: label
  }));

  selectedState: string | null = null;
  selectedCountry: string | null = null;
  subcityOptions: { value: string; label: string }[] = [];


  ngOnInit(): void {
    this.initializeFormValues();
    this.subscribeToFormChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeFormValues(): void {
    this.latitude = this.parentForm.get('latitude')?.value || 0;
    this.longitude = this.parentForm.get('longitude')?.value || 0;
    this.selectedCountry = this.parentForm.get('country')?.value || null;
    this.selectedState = this.parentForm.get('state')?.value || null;
    this.cdr.markForCheck();
  }

  private subscribeToFormChanges(): void {
    const countrySub = this.parentForm.get('country')?.valueChanges.subscribe(value => {
      this.selectedCountry = value;
      this.cdr.markForCheck();
    });
  
    if (countrySub) this.subscriptions.push(countrySub);
  
    const stateSub = this.parentForm.get('state')?.valueChanges.subscribe(stateValue => {
      this.selectedState = stateValue;
      // Handle subcity options based on selected state
      if (stateValue && this.subcities[stateValue]) {
        this.subcityOptions = this.subcities[stateValue].map(sub => ({
          value: sub,
          label: sub
        }));
        this.parentForm.get('subcity')?.enable(); // Enable subcity dropdown
      } else {
        this.subcityOptions = [];
        this.parentForm.get('subcity')?.reset(); // Clear selection
        this.parentForm.get('subcity')?.disable(); // Disable subcity dropdown
      }
      this.cdr.markForCheck();
    });
  
    if (stateSub) this.subscriptions.push(stateSub);
  
    const latSub = this.parentForm.get('latitude')?.valueChanges.subscribe(value => {
      this.latitude = value || 0;
      this.cdr.markForCheck();
    });
    if (latSub) this.subscriptions.push(latSub);
  
    const lngSub = this.parentForm.get('longitude')?.valueChanges.subscribe(value => {
      this.longitude = value || 0;
      this.cdr.markForCheck();
    });
    if (lngSub) this.subscriptions.push(lngSub);
  }
  

  onPositionSelected(coordinates: [number, number]) {
    this.selectedPosition = coordinates;
    this.latitude = coordinates[0];
    this.longitude = coordinates[1];
    this.parentForm.get('latitude')?.setValue(this.latitude);
    this.parentForm.get('longitude')?.setValue(this.longitude);
    this.cdr.markForCheck();
  }

  

  onCountrySelected(countryKey: string) {
    this.selectedCountry = countryKey;
    this.parentForm.get('country')?.setValue(countryKey);
    this.cdr.markForCheck();
  }
  selectedSubcity: string | null = null;

  onStateSelected(stateKey: string) {
    this.selectedState = stateKey;
    this.parentForm.get('state')?.setValue(stateKey);
    this.parentForm.get('subcity')?.reset();

    this.cdr.markForCheck();
  }  
  onSubcitySelected(subcity: string) {
    this.parentForm.get('subcity')?.setValue(subcity);
  }
  

  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
