import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-sidebar',
  templateUrl: './owner-sidebar.component.html',
  styleUrls: ['./owner-sidebar.component.css']
})
export class OwnerSidebarComponent {
  isCollapsed = false;
  
 

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  
}
