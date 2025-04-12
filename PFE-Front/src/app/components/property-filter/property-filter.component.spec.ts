import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFilterComponent } from './property-filter.component';

describe('PropertyFilterComponent', () => {
  let component: PropertyFilterComponent;
  let fixture: ComponentFixture<PropertyFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyFilterComponent]
    });
    fixture = TestBed.createComponent(PropertyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
