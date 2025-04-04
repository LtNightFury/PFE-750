import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTabComponent } from './location-tab.component';

describe('LocationTabComponent', () => {
  let component: LocationTabComponent;
  let fixture: ComponentFixture<LocationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationTabComponent]
    });
    fixture = TestBed.createComponent(LocationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
