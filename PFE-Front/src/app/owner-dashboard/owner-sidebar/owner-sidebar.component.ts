import { Component } from '@angular/core';
import { AuthService } from 'src/app/login-register-verif/services/auth.service';
import { userprofile } from 'src/app/models/property.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-owner-sidebar',
  templateUrl: './owner-sidebar.component.html',
  styleUrls: ['./owner-sidebar.component.css']
})
export class OwnerSidebarComponent {
  isCollapsed = false;
  currentUser: any= null; // You can define a proper type for your user here
  user: any;
  
 

  constructor( private authService: AuthService ,private userService: UserService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
       
    });
    this.userService.getUserProfile().subscribe(user => {
      this.user = user;
    });
    console.log(this.currentUser);
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  getImageUrl(path: string): string {
    if (!path) return '/assets/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }
}
