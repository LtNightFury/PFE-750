import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent {

   users: User[] = [];
  searchText: string = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.propertyService.getallusers().subscribe((data) => {
      this.users = data;
    });
  }

  filteredUsers(): User[] {
    const search = this.searchText.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.lastName?.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
    );
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.propertyService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter((user) => user.id !== id);
      });
    }
  }

  getFullImageUrl(relativePath: string): string {
    return 'http://backend.ddev.site' + relativePath;
  }
}
