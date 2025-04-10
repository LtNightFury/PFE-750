import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-price-tab',
  templateUrl: './price-tab.component.html',
  styleUrls: ['./price-tab.component.css']
})
export class PriceTabComponent implements OnInit, OnChanges {
  @Input() parentForm!: FormGroup;
  @Input() dealType: string = 'sale';
  
  constructor() { }
  
  ngOnInit(): void {
    // Initial setup
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in dealType
    if (changes['dealType']) {
      console.log('Deal type changed to:', this.dealType);
      // You can update your form or UI based on the new deal type
    }
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  
  get isRental(): boolean {
    return this.dealType === 'rent';
  }


  
}