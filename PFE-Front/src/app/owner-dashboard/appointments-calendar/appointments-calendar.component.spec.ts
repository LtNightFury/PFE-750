import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsCalendarComponent } from './appointments-calendar.component';

describe('AppointmentsCalendarComponent', () => {
  let component: AppointmentsCalendarComponent;
  let fixture: ComponentFixture<AppointmentsCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentsCalendarComponent]
    });
    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
