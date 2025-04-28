import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCard2Component } from './property-card2.component';

describe('PropertyCard2Component', () => {
  let component: PropertyCard2Component;
  let fixture: ComponentFixture<PropertyCard2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyCard2Component]
    });
    fixture = TestBed.createComponent(PropertyCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
