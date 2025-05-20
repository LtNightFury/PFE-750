import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
isCollapsed = false;
  screenWidth: number;
  
  constructor() {
    // Get initial screen width
    this.screenWidth = window.innerWidth;
    // Auto-collapse for mobile devices
    this.checkScreenWidth();
  }

  ngOnInit(): void {
    // Check if user preference exists in localStorage
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      this.isCollapsed = savedState === 'collapsed';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    // Auto-collapse for mobile/small screens
    if (this.screenWidth <= 768) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Save state to localStorage
    localStorage.setItem('sidebarState', this.isCollapsed ? 'collapsed' : 'expanded');
  }
  shouldShowTooltip(): boolean {
    return this.isCollapsed && this.screenWidth > 768;
  }
}
