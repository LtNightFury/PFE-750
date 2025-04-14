import { Component, Input, Output, EventEmitter, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: { value: string; label: string; disabled?: boolean }[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() selectedValue: string | null = null;
  @Output() optionSelected = new EventEmitter<string>();
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;

  isOpen: boolean = false;

  // ControlValueAccessor implementation
  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private eRef: ElementRef) {}

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.onTouched();
    }
  }

  // Toggle the dropdown open/close
  toggleDropdown(event: Event) {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;
    event.stopPropagation();
    this.onTouched();

    // Smart dropdown direction
    setTimeout(() => {
      const dropdown = this.eRef.nativeElement.querySelector('.dropdown-content');
      if (!dropdown) return;
      
      const rect = dropdown.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > windowHeight) {
        dropdown.style.top = 'auto';
        dropdown.style.bottom = '100%'; // flip upward
      } else {
        dropdown.style.top = '100%';
        dropdown.style.bottom = 'auto';
      }
    });
  }

  // Select an option from the dropdown
  selectOption(option: { value: string; label: string; disabled?: boolean }) {
    if (option.disabled || this.disabled) return;

    this.selectedValue = option.value;
    this.isOpen = false;
    this.onChange(option.value); // Notify form of value change
    this.onTouched(); // Mark as touched
    this.optionSelected.emit(option.value);
  }

  // Getter method to get the selected label or placeholder
  get selectedLabel(): string {
    const selectedOption = this.options.find(o => o.value === this.selectedValue);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}