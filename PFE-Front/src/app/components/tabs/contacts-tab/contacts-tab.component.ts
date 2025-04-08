import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contacts-tab',
  templateUrl: './contacts-tab.component.html',
  styleUrls: ['./contacts-tab.component.css']
})
export class ContactsTabComponent {
    @Input() parentForm!: FormGroup;
    isInvalid(controlName: string): boolean {
      const control = this.parentForm.get(controlName);
      return control ? control.invalid && (control.dirty || control.touched) : false;
    }
    
  

}
