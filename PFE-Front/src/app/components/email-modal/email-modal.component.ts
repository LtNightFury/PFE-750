// email-modal.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login-register-verif/services/auth.service';
import { EmailData, PropertyService } from 'src/app/services/property.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

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
    private propertyService: PropertyService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    // Initialize form with empty values first
    this.initializeForm('', '');
    
    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      // Try to get data from JWT first (for email)
      const currentUser = this.authService.currentUser;
      const userEmail = currentUser?.email || '';
      
      console.log('JWT currentUser:', currentUser);
      
      // Fetch complete user profile from API
      this.userService.getUserProfile().subscribe({
        next: (userProfile) => {
          console.log('User profile from API:', userProfile);
          
          // Extract full name
          let userName = '';
          if (userProfile.name) {
            userName = userProfile.name;
            // Add lastname if exists
            if (userProfile.lastname || userProfile.lastName) {
              userName += ' ' + (userProfile.lastname || userProfile.lastName);
            }
          }
          
          console.log('Final userName:', userName);
          console.log('Final userEmail:', userProfile.email || userEmail);
          
          // Update form with fetched user data
          this.emailForm.patchValue({
            name: userName,
            email: userProfile.email || userEmail
          });
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
          // Fallback to JWT data if API call fails
          if (currentUser?.email) {
            this.emailForm.patchValue({
              email: currentUser.email
            });
          }
        }
      });
    } else {
      console.log('User not logged in');
    }
  }
  
  private initializeForm(name: string = '', email: string = ''): void {
    this.emailForm = this.fb.group({
      name: [name, [Validators.required]],
      email: [email, [Validators.required, Validators.email]],
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

  console.log('Sending email data:', emailData);

  this.propertyService.sendEmailToOwner(emailData).subscribe({
    next: (response) => {
      this.isSubmitting = false;
      this.emailSent.emit(true);

      // ✅ Show SweetAlert success popup
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your email was successfully sent to the agent.',
        timer: 2500,
        showConfirmButton: false
      });

      // Close modal after 2 seconds
      setTimeout(() => this.close.emit(), 2000);
    },
    error: (error) => {
      this.isSubmitting = false;
      this.hasError = true;
      this.errorMessage = error.message || 'Failed to send email. Please try again.';

      // ❌ Show SweetAlert error popup
      Swal.fire({
        icon: 'error',
        title: 'Sending Failed',
        text: this.errorMessage
      });
    }
  });
} 
  
  closeModal(): void {
    this.close.emit();
  }
}