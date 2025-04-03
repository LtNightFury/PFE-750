import { Component } from '@angular/core';
import { FormGroup,FormBuilder,FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.required]]
    });
  }
 
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: () => {
        //lena n7ot lwin bch ymchi
        // par exemple l page dashboard
        // w n7ot l token fi local storage
        // localStorage.setItem('auth_token', response.token);
        // w n7ot l user fi local storage
        // localStorage.setItem('user', JSON.stringify(response.user));
        // w n7ot l user fi service
        // this.authService.setUser(response.user);
        // w n7ot l token fi service
        // this.authService.setToken(response.token);
        this.router.navigate(['/register']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
