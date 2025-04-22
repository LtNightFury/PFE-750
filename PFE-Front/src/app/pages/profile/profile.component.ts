import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  firstName: string = '';
  lastName: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        // Split name into first and last name (assuming format is "First Last")
        
        this.firstName = this.user.name || '';
        this.lastName = this.user.lastName || '';
        this.loading = false;
      },      error: (err) => {
        console.error('Failed to load user profile', err);
        this.loading = false;
      }
    });
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
