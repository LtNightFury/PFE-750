import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPropertyListComponent } from './admin-property-list.component';

describe('AdminPropertyListComponent', () => {
  let component: AdminPropertyListComponent;
  let fixture: ComponentFixture<AdminPropertyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPropertyListComponent]
    });
    fixture = TestBed.createComponent(AdminPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
