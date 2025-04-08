import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-amenities-tab',
  templateUrl: './amenities-tab.component.html',
  styleUrls: ['./amenities-tab.component.css']
})
export class AmenitiesTabComponent {
   @Input() parentForm!: FormGroup;

}
