import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  notifications: Notification[] = [];
  dropdownOpen = false;
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNewOwnerNotifications().subscribe(data => {
      this.notifications = data;
       this.unreadCount = data.filter(n => !n.isRead).length;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    console.log('Dropdown toggled:', this.dropdownOpen);
  }

  markNotificationAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
       this.unreadCount--;
    });
  }
  
}