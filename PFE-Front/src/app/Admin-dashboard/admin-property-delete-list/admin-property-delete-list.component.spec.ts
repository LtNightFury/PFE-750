import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPropertyDeleteListComponent } from './admin-property-delete-list.component';

describe('AdminPropertyDeleteListComponent', () => {
  let component: AdminPropertyDeleteListComponent;
  let fixture: ComponentFixture<AdminPropertyDeleteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPropertyDeleteListComponent]
    });
    fixture = TestBed.createComponent(AdminPropertyDeleteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
