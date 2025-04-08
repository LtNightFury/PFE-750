import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-price-tab',
  templateUrl: './price-tab.component.html',
  styleUrls: ['./price-tab.component.css']
})
export class PriceTabComponent {
  @Input() parentForm!: FormGroup;
 
 
  
  constructor() { }
  
  ngOnInit(): void {
    
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.parentForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
