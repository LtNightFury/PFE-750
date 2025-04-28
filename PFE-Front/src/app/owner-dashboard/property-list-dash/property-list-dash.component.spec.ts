import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListDashComponent } from './property-list-dash.component';

describe('PropertyListDashComponent', () => {
  let component: PropertyListDashComponent;
  let fixture: ComponentFixture<PropertyListDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyListDashComponent]
    });
    fixture = TestBed.createComponent(PropertyListDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
