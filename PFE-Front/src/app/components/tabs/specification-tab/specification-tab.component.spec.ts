import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationTabComponent } from './specification-tab.component';

describe('SpecificationTabComponent', () => {
  let component: SpecificationTabComponent;
  let fixture: ComponentFixture<SpecificationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationTabComponent]
    });
    fixture = TestBed.createComponent(SpecificationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
