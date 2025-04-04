import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTabComponent } from './price-tab.component';

describe('PriceTabComponent', () => {
  let component: PriceTabComponent;
  let fixture: ComponentFixture<PriceTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriceTabComponent]
    });
    fixture = TestBed.createComponent(PriceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
