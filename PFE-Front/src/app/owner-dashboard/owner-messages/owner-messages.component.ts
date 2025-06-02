// src/app/components/owner-messages/owner-messages.component.ts

import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/services/property.service';
import { Message } from 'src/app/models/message.model';
import { formatDate } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-owner-messages',
  templateUrl: './owner-messages.component.html',
  styleUrls: ['./owner-messages.component.css']
})
export class OwnerMessagesComponent implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  selectedMessage: Message | null = null;
  replyText = '';
  currentPage = 1;
  messagesPerPage = 10;
  totalMessages = 0;
  searchQuery = '';
  loading = true;
  
  constructor(private propertyService: PropertyService, private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.fetchMessages();
  }
  
  fetchMessages(): void {
    this.loading = true;
    this.messageService.getEmailMessages().subscribe(
      (data: Message[]) => {
        this.messages = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredMessages = [...this.messages];
        this.totalMessages = this.messages.length;
        this.loading = false;
      },
      error => {
        console.error('Error fetching messages:', error);
        this.loading = false;
      }
    );
  }
  
  selectMessage(message: Message): void {
    this.selectedMessage = message;
    
    // Mark as read if it wasn't already
    if (!message.isRead) {
      message.isRead = true;
      // Here you would typically update the read status in the backend
       this.messageService.markMessageAsRead(message.id).subscribe();
    }
  }
  
  closeMessage(): void {
    this.selectedMessage = null;
    this.replyText = '';
  }
  
  sendReply(): void {
    if (!this.selectedMessage || !this.replyText.trim()) return;
    
    const messageId = this.selectedMessage.id;
    const replyPayload = { message: this.replyText };
    
    this.messageService.sendOwnerReply(messageId, replyPayload).subscribe(
      () => {
        // Add reply to UI immediately (optimistic update)
        if (this.selectedMessage) {
          if (!this.selectedMessage.replies) {
            this.selectedMessage.replies = [];
          }
          
          this.selectedMessage.replies.push({
            id: Math.floor(Math.random() * 10000), // Temporary ID
            message: this.replyText,
            createdAt: new Date().toISOString(),
            sender: 'You' // Could be replaced with actual user info
          });
          
          this.replyText = '';
        }
      },      error => {
        console.error('Error sending reply:', error);
        alert('Failed to send reply. Please try again.');
      }
    );
  }
  
  searchMessages(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMessages = [...this.messages];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredMessages = this.messages.filter(msg => 
      msg.subject.toLowerCase().includes(query) || 
      msg.message.toLowerCase().includes(query) ||
      msg.sender.name.toLowerCase().includes(query) ||
      msg.sender.email.toLowerCase().includes(query) ||
      msg.Property.generalinfo.title.toLowerCase().includes(query)
    );
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredMessages = [...this.messages];
  }
  
  formatMessageDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    
    // If it's today, show time only
    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return formatDate(dateString, 'HH:mm', 'en-US');
    }
    
    // If it's this year, show month and day
    if (date.getFullYear() === today.getFullYear()) {
      return formatDate(dateString, 'MMM dd', 'en-US');
    }
    
    // Otherwise show full date
    return formatDate(dateString, 'MMM dd, yyyy', 'en-US');
  }
  
  get paginatedMessages(): Message[] {
    const startIndex = (this.currentPage - 1) * this.messagesPerPage;
    return this.filteredMessages.slice(startIndex, startIndex + this.messagesPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredMessages.length / this.messagesPerPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  getUnreadCount(): number {
    return this.messages.filter(msg => !msg.isRead).length;
  }
  
  getSenderInitials(message: Message): string {
    return (message.sender.name.charAt(0) + message.sender.lastname.charAt(0)).toUpperCase();
  }
  hasValidProfileImage(sender: any): boolean {
  return sender.profileImage && 
         typeof sender.profileImage === 'string' && 
         sender.profileImage.includes('uploads');
}

getProfileImageUrl(profileImage: string | null): string {
  // If profileImage is null, undefined, or doesn't contain 'uploads', return default image
  if (!profileImage || !profileImage.includes('uploads')) {
    return '/assets/default-avatar.png'; // Put your default image in assets folder
  }
  return 'http://backend.ddev.site' + profileImage;
}

onImageError(event: any): void {
  // Fallback when image fails to load
  event.target.src = '/assets/default-avatar.png';
}
}