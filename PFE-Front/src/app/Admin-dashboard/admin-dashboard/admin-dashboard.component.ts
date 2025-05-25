import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChartOptions, ChartType, ChartData, ChartConfiguration } from 'chart.js';
import { User } from 'src/app/models/user.model';
import { PropertyService } from 'src/app/services/property.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('propertyChart') propertyChart?: BaseChartDirective;
  @ViewChild('userChart') userChart?: BaseChartDirective;
  
  users: User[] = [];
  totalUsers = 0;
  totalOwners = 0;
  totalProperties = 0;
  pendingProperties = 0;
  showUserChart = false;

  // Add loading flags
  userGrowthLoaded = false;
  propertyGrowthLoaded = false;

  public pieChartType: ChartType = 'doughnut';

  public pieChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Owners', 'Users'],
    datasets: [
      {
        data: [10, 40], // Replace with dynamic values
        backgroundColor: ['#4F46E5', '#06B6D4'],
        hoverBackgroundColor: ['#6366F1', '#22D3EE'],
        borderWidth: 2,
        borderColor: '#ffffff',
      }
    ]
  };

  public pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + (b as number), 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Users vs Owners Distribution',
        font: {
          size: 16
        },
        color: '#333'
      }
    }
  };

  public userGrowthData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'User Registrations',
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.3)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  public propertyGrowthData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Property Listings',
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.3)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true, // Add this
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    // Add animation config to prevent render issues
    animation: {
      onComplete: () => {
        // Force update after animation completes
        this.cdr.detectChanges();
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.propertyService.getallusers().subscribe((data) => {
      this.users = data;
    });
  }

  ngAfterViewInit(): void {
    // Load chart data after view is initialized
    setTimeout(() => {
      this.loadUserGrowth();
      this.loadPropertyGrowth();
    }, 100);
  }

  loadDashboardData(): void {
    this.propertyService.getallusers().subscribe(users => {
      this.totalUsers = users.length;
      this.totalOwners = users.filter(user => user.roles.includes('ROLE_OWNER')).length;
      const regularUsers = this.totalUsers - this.totalOwners;
      this.pieChartData.datasets[0].data = [this.totalOwners, regularUsers];
    });
    
    this.propertyService.getAllProperties().subscribe(properties => {
      this.totalProperties = properties.length;
    }); 
    
    this.propertyService.getAdminProperties().subscribe(properties => {
      this.pendingProperties = properties.filter(p => p.approval === 'pending').length;
    });
  }

  loadUserGrowth(): void {
    this.propertyService.getUserGrowthOverTime().subscribe(data => {
      this.userGrowthData.labels = data.map(d => d.date);
      this.userGrowthData.datasets[0].data = data.map(d => d.count);
      this.userGrowthLoaded = true;
      
      // Force chart update after data is loaded
      setTimeout(() => {
        this.userChart?.update();
        this.cdr.detectChanges();
      }, 50);
    });
  }

  loadPropertyGrowth(): void {
    this.propertyService.getPropertyGrowthOverTime().subscribe(data => {
      this.propertyGrowthData.labels = data.map(d => d.date);
      this.propertyGrowthData.datasets[0].data = data.map(d => d.count);
      this.propertyGrowthLoaded = true;
      
      // Force chart update after data is loaded
      setTimeout(() => {
        this.propertyChart?.update();
        this.cdr.detectChanges();
      }, 50);
    });
  }

  getImageUrl(path: string): string {
    if (!path) return '/assets/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `http://backend.ddev.site${path.startsWith('/') ? path : '/' + path}`;
  }

  getFullImageUrl(imagePath: string): string {
    return `http://backend.ddev.site${imagePath}`;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ROLE_USER':
        return 'bg-success';
      case 'ROLE_OWNER':
        return 'bg-warning text-dark';
      case 'ROLE_ADMIN':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}