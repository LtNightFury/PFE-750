import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashLayoutComponent } from './admin-dash-layout.component';

describe('AdminDashLayoutComponent', () => {
  let component: AdminDashLayoutComponent;
  let fixture: ComponentFixture<AdminDashLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashLayoutComponent]
    });
    fixture = TestBed.createComponent(AdminDashLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
