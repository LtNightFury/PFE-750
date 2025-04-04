import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsTabComponent } from './contacts-tab.component';

describe('ContactsTabComponent', () => {
  let component: ContactsTabComponent;
  let fixture: ComponentFixture<ContactsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactsTabComponent]
    });
    fixture = TestBed.createComponent(ContactsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
