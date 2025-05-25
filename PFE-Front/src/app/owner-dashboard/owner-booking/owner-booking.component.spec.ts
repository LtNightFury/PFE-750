import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerBookingComponent } from './owner-booking.component';

describe('OwnerBookingComponent', () => {
  let component: OwnerBookingComponent;
  let fixture: ComponentFixture<OwnerBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerBookingComponent]
    });
    fixture = TestBed.createComponent(OwnerBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
