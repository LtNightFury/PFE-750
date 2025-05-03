import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyViewsComponent } from './property-views.component';

describe('PropertyViewsComponent', () => {
  let component: PropertyViewsComponent;
  let fixture: ComponentFixture<PropertyViewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyViewsComponent]
    });
    fixture = TestBed.createComponent(PropertyViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
