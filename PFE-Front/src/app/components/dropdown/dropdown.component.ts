import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Input() options: { value: string; label: string; disabled?: boolean }[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() selectedValue: string | null = null; // Ensures the selected value is controlled by the parent
  @Output() optionSelected = new EventEmitter<string>();
  @Input() customClass: string = '';

  isOpen: boolean = false;

  constructor(private eRef: ElementRef) {}
  

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // Toggle the dropdown open/close
  toggleDropdown(event: Event) {
    this.isOpen = !this.isOpen;
    event.stopPropagation(); // Prevents event from closing dropdown immediately
  }

  // Select an option from the dropdown
  selectOption(option: { value: string; label: string; disabled?: boolean }) {
    if (option.disabled) return;

    this.selectedValue = option.value;
    this.isOpen = false;
    this.optionSelected.emit(option.value); // Emits the correct value, not the label
  }

  // Getter method to get the selected label or placeholder
  get selectedLabel(): string {
    const selectedOption = this.options.find(o => o.value === this.selectedValue);
    return selectedOption ? selectedOption.label : this.placeholder;
  }
}
