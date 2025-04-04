import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationTabComponent } from './publication-tab.component';

describe('PublicationTabComponent', () => {
  let component: PublicationTabComponent;
  let fixture: ComponentFixture<PublicationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicationTabComponent]
    });
    fixture = TestBed.createComponent(PublicationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
