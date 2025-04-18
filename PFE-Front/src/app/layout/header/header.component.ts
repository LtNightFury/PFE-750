import { Component } from '@angular/core';
import { AuthService } from 'src/app/login-register-verif/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  currentUser: any = null; // You can define a proper type for your user here

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = this.authService.isLoggedIn();
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
