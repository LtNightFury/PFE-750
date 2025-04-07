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
  
}