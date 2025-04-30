import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from 'src/app/models/Appointment.model';
import { PropertyService } from 'src/app/services/property.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  @Input() propertyId!: number;
  @Output() appointmentScheduled = new EventEmitter<Appointment>();
  @Output() formClosed = new EventEmitter<void>();
  
  appointmentForm!: FormGroup;
  availableTimeSlots: string[] = [];
  isLoading = false;
  submitting = false;
  error: string | null = null;
  currentUser: any = null;
  
  // Minimum date is tomorrow
  minDate: string;
  
  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private userService: UserService
  ) {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }
  
  ngOnInit(): void {
    this.currentUser = this.userService.getUserProfile();
    this.userService.getUserProfile().subscribe(user => {
      console.log('Fetched user:', user);
      const fullName = `${user.name} ${user.lastName}`;
    this.appointmentForm.patchValue({
      name: fullName,      // Full name field
      email: user.email,
      phone: user.phoneNumber
      });
      
    });
    
    this.appointmentForm = this.fb.group({
      name: [this.currentUser?.name || '', ],
      email: [this.currentUser?.email || '', ],
      phone: [this.currentUser?.phoneNumber || '', ],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      message: ['']
    });
    
    // Watch for date changes to load available time slots
    this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe((date) => {
      if (date) {
        this.loadAvailableTimeSlots(date);
      } else {
        this.availableTimeSlots = [];
      }
    });
  }
  
  loadAvailableTimeSlots(date: string): void {
    this.isLoading = true;
    this.availableTimeSlots = [];
    
    this.propertyService.getAvailableAppointmentSlots(this.propertyId, date)
      .subscribe({
        next: (slots) => {
          this.availableTimeSlots = slots.availableSlots;

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading time slots', err);
          this.error = 'Unable to load available time slots. Please try again.';
          this.isLoading = false;
          
          // For testing purposes, generate some dummy slots
          this.availableTimeSlots = this.generateDummyTimeSlots();
        }
      });
  }
  
  generateDummyTimeSlots(): string[] {
    // This is just for testing until your backend is ready
    return [
      '10:00', '10:30', '11:00', '11:30', '12:00',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
  }
  
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
        
      });
      console.log(this.appointmentForm.value);
      return;
    }
    
    this.submitting = true;
    
    const appointment: Appointment = {
      propertyId: this.propertyId,
      name: this.appointmentForm.value.name,
      email: this.appointmentForm.value.email,
      phone: this.appointmentForm.value.phone,
      appointmentDate: this.appointmentForm.value.appointmentDate,
      appointmentTime: this.appointmentForm.value.appointmentTime,
      message: this.appointmentForm.value.message,
      propertyTitle: '',
      propertycity: '',
      lastName: '',
      userPhone: ''
    };
    
    this.propertyService.scheduleAppointment(appointment)
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.appointmentScheduled.emit(response);
        },
        error: (err) => {
          console.error('Error scheduling appointment', err);
          this.error = 'Failed to schedule appointment. Please try again.';
          this.submitting = false;
        }
      });
  }
  
  closeForm(): void {
    this.formClosed.emit();
  }

}
