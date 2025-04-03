import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage: string = '';
  loading: boolean = false;
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        this.createPasswordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch }); // <-- Add the custom validator here
  }

  // Custom validator for password strength
  createPasswordStrengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  // Custom validator to check if passwords match
  passwordsMatch(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getPasswordErrorMessage(): string {
    const control = this.registerForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    }
    if (control?.hasError('minLength')) {
      return 'Password must be at least 8 characters long';
    }
    if (control?.hasError('maxLength')) {
      return 'Password cannot exceed 30 characters';
    }
    if (control?.hasError('passwordStrength')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log("Form submitted:", this.registerForm.value);
      
      const formData = this.registerForm.value;
      this.authService.register(formData.name, formData.email, formData.password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('Error during registration:', err);
        }
      });
    } else {
      console.log('Form invalid');
      const formControls = this.registerForm.controls;
      for (const controlName in formControls) {
        if (formControls[controlName].invalid) {
          console.log(`Field ${controlName} is invalid`);
        }
      }
    }
  }
}