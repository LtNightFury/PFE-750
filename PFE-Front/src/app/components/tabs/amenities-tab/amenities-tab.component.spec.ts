import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitiesTabComponent } from './amenities-tab.component';

describe('AmenitiesTabComponent', () => {
  let component: AmenitiesTabComponent;
  let fixture: ComponentFixture<AmenitiesTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmenitiesTabComponent]
    });
    fixture = TestBed.createComponent(AmenitiesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
