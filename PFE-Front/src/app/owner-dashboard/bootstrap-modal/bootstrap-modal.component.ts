import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bootstrap-modal',
  templateUrl: './bootstrap-modal.component.html'
})
export class BootstrapModalComponent {
  @Input() modalId = 'defaultModal';
  @Input() title = '';
  @Input() size: 'sm' | 'lg' | 'xl' | '' = '';
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}