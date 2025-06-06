import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/login-register-verif/services/auth.service';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  selectedMessage: Message | null = null;
  replyText = '';
  currentPage = 1;
  messagesPerPage = 10;
  totalMessages = 0;
  searchQuery = '';
  loading = true;

  constructor(private messageService: MessageService,
              private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages(): void {
    this.loading = true;
    this.messageService.getUserMessages().subscribe(
      (data: Message[]) => {
        this.messages = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredMessages = [...this.messages];
        this.totalMessages = this.messages.length;
        this.loading = false;
      },
      error => {
        console.error('Error fetching user messages:', error);
        this.loading = false;
      }
    );
  }

  selectMessage(message: Message): void {
    this.selectedMessage = message;

    if (!message.isRead) {
      message.isRead = true;
      this.messageService.markMessageAsRead(message.id).subscribe();
    }
  }

  closeMessage(): void {
    this.selectedMessage = null;
    this.replyText = '';
  }

  sendReply(): void {
  if (!this.selectedMessage || !this.replyText.trim()) return;

  const currentUser = this.authService.currentUser;
  if (!currentUser || !currentUser.roles || currentUser.roles.length === 0) {
    alert('User role not found or user not authenticated.');
    return;
  }

  const isOwnerOrAdmin = currentUser.roles.includes('ROLE_OWNER') || currentUser.roles.includes('ROLE_ADMIN');
  const messageId = this.selectedMessage.id;
  const replyPayload = { message: this.replyText };

  const sendReplyObservable = isOwnerOrAdmin
    ? this.messageService.sendOwnerReply(messageId, replyPayload)
    : this.messageService.sendUserReply(messageId, replyPayload);

  sendReplyObservable.subscribe(
    () => {
      if (this.selectedMessage) {
        this.selectedMessage.replies ??= [];
        this.selectedMessage.replies.push({
          id: Math.floor(Math.random() * 10000), // temporary ID
          message: this.replyText,
          createdAt: new Date().toISOString(),
          sender: 'You'
        });
      }

      this.replyText = '';
    },
    error => {
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

    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return formatDate(dateString, 'HH:mm', 'en-US');
    }

    if (date.getFullYear() === today.getFullYear()) {
      return formatDate(dateString, 'MMM dd', 'en-US');
    }

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
  return sender && 
         sender.profileImage && 
         typeof sender.profileImage === 'string' && 
         sender.profileImage.includes('uploads');
}

getProfileImageUrl(profileImage: string | null): string {
  // If profileImage is null, undefined, or doesn't contain 'uploads', return default image
  if (!profileImage || !profileImage.includes('uploads')) {
    return 'assets/images/default-avatar.png'; // Put your default image in assets folder
  }
  return 'http://backend.ddev.site' + profileImage;
}

onImageError(event: any): void {
  // Fallback when image fails to load
  event.target.src = 'assets/images/default-avatar.png';
}
}
