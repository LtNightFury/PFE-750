// general-tab.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.css']
})
export class GeneralTabComponent implements OnInit {
  @Input() parentForm!: FormGroup ;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.parentForm.addControl('dealType', this.fb.control('sale', [Validators.required]));
    this.parentForm.addControl('reference', this.fb.control('', [Validators.required]));
    this.parentForm.addControl('status', this.fb.control('', [Validators.required]));
    this.parentForm.addControl('category', this.fb.control('', [Validators.required]));
    this.parentForm.addControl('broker', this.fb.control('john-doe', [Validators.required]));
    this.parentForm.addControl('workflow', this.fb.control(''));
  }
}