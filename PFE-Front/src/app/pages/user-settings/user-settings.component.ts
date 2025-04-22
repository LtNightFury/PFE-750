import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {

  user: User | null = null;
  loading = true;
  userForm: FormGroup;
  passwordForm: FormGroup;
  showPasswordFields = false;
  profileImageFile: File | null = null;
  profileImagePreview: string | null = null;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // Initialize forms with empty values
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        
        // Split name into first and last name (assuming format is "First Last")
        const nameParts = this.user.name.split(' ');
        const name = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Set form values
        this.userForm.patchValue({
          name: name,
          lastName: lastName,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber || ''
        });
        
        // Set profile image
        if (this.user.profileImage) {
          this.profileImagePreview = this.user.profileImage;
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert('File size should be less than 10MB');
        return;
      }
      
      this.profileImageFile = file;
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

 

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;
    if (!this.showPasswordFields) {
      this.passwordForm.reset();
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      if (
        this.showPasswordFields &&
        this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword
      ) {
        alert('New password and confirmation do not match.');
        return;
      }
      
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.showPasswordFields && this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    // Check if a new profile image is being uploaded
  const hasImageChange = this.profileImageFile !== null;
  // Check if we're changing the password
  const hasPasswordChange = this.showPasswordFields && this.passwordForm.valid;
  

  if (hasImageChange) {
    const formData = new FormData();
    
    // Combine first and last name
    formData.append('name', this.userForm.value.name);
formData.append('lastname', this.userForm.value.lastName);
formData.append('email', this.userForm.value.email);
    
    if (this.userForm.value.phoneNumber) {
      formData.append('phoneNumber', this.userForm.value.phoneNumber);
    }
    
    formData.append('file', this.profileImageFile as File);   
    
    this.userService.updateUserProfileWithImage(formData).subscribe({
      next: (updatedUser) => {
        // Handle successful profile update
        console.log('Profile updated successfully', updatedUser);
        
        // If we also need to update password
        if (hasPasswordChange) {
          this.updatePassword();
        } else {
          alert('Profile updated successfully!');
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Error updating profile. Please try again.');
      }
    });
  } 
  // No image change, use regular JSON submission
  else {
    const userData = {
      name: this.userForm.value.name,
      lastname: this.userForm.value.lastName,
      email: this.userForm.value.email,
      phoneNumber: this.userForm.value.phoneNumber || null
    };
    
    this.userService.updateUserProfile(userData).subscribe({
      next: (updatedUser) => {
        // Handle successful profile update
        console.log('Profile updated successfully', updatedUser);
        
        // If we also need to update password
        if (hasPasswordChange) {
          this.updatePassword();
        } else {
          alert('Profile updated successfully!');
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Error updating profile. Please try again.');
      }
    });
  }
}

// Helper method to update password
private updatePassword(): void {
  const passwordData = {
    currentPassword: this.passwordForm.value.currentPassword,
    newPassword: this.passwordForm.value.newPassword
  };
  
  this.userService.changePassword(passwordData).subscribe({
    next: () => {
      alert('Profile and password updated successfully!');
      this.router.navigate(['/profile']);
    },
    error: (err) => {
      console.error('Error updating password', err);
      alert('Profile updated but there was an error updating password. Please try again.');
      this.router.navigate(['/profile']);
    }
  });
}

// Add a method for removing profile image
removeProfileImage(): void {
  if (this.profileImagePreview && !this.profileImageFile) {
    // This means we're removing an existing image from the server
    this.userService.removeProfileImage().subscribe({
      next: () => {
        this.profileImagePreview = null;
        console.log('Profile image removed successfully');
      },
      error: (err) => {
        console.error('Error removing profile image', err);
        alert('Error removing profile image. Please try again.');
      }
    });
  } else {
    // Just removing the selected file without server call
    this.profileImageFile = null;
    this.profileImagePreview = this.user?.profileImage || null;
  }}

  cancel(): void {
    this.router.navigate(['/profile']);
  }
  
}
