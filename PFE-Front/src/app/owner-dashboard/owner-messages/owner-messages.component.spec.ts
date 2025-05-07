import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMessagesComponent } from './owner-messages.component';

describe('OwnerMessagesComponent', () => {
  let component: OwnerMessagesComponent;
  let fixture: ComponentFixture<OwnerMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerMessagesComponent]
    });
    fixture = TestBed.createComponent(OwnerMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
