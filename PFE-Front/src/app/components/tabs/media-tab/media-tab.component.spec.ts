import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTabComponent } from './media-tab.component';

describe('MediaTabComponent', () => {
  let component: MediaTabComponent;
  let fixture: ComponentFixture<MediaTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediaTabComponent]
    });
    fixture = TestBed.createComponent(MediaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
