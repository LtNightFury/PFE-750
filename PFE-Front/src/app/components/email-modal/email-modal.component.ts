import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailData, PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent implements OnInit {
  @Input() propertyId!: number;
  @Input() recipientId!: number;
  @Input() recipientName: string = 'Agent';
  
  @Output() close = new EventEmitter<void>();
  @Output() emailSent = new EventEmitter<boolean>();
  
  emailForm!: FormGroup;
  isSubmitting = false;
  hasError = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService
  ) {}
  
  ngOnInit(): void {
    this.emailForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  onSubmit(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.hasError = false;
    
    const emailData: EmailData = {
      ...this.emailForm.value,
      propertyId: this.propertyId,
      recipientId: this.recipientId
    };
    
    this.propertyService.sendEmailToOwner(emailData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.emailSent.emit(true);
        setTimeout(() => this.close.emit(), 2000); // Close after 2 seconds
      },
      error: (error) => {
        this.isSubmitting = false;
        this.hasError = true;
        this.errorMessage = error.message || 'Failed to send email. Please try again.';
      }
    });
  }
  
  closeModal(): void {
    this.close.emit();
  }
}
