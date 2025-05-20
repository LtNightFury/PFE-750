import { Component } from '@angular/core';
import { AuthService } from 'src/app/login-register-verif/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  currentUser: any = null; // You can define a proper type for your user here
  showDropdown: boolean = false;
  showMobileMenu: boolean = false;
  user: any;
  roles: string[] = [];

  constructor(private authService: AuthService, private userService: UserService) {}
  getImageUrl(path: string): string {
    if (!path) return '/assets/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = this.authService.isLoggedIn();
      console.log(this.currentUser);
      
       
    });
    this.userService.getUserProfile().subscribe(user => {
      this.user = user;
    });
    console.log(this.currentUser);
  }
  
  logout(): void {
    this.authService.logout();
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      if (this.showMobileMenu) {
        navLinks.classList.add('active');
      } else {
        navLinks.classList.remove('active');
      }
    }
  }
  onDocumentClick(event: MouseEvent): void {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile && !userProfile.contains(event.target as Node) && this.showDropdown) {
      this.showDropdown = false;
    }
  }
  

}
