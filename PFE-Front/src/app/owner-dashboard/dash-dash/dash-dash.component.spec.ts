import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDashComponent } from './dash-dash.component';

describe('DashDashComponent', () => {
  let component: DashDashComponent;
  let fixture: ComponentFixture<DashDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashDashComponent]
    });
    fixture = TestBed.createComponent(DashDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
