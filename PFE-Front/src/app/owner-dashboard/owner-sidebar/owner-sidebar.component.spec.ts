import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSidebarComponent } from './owner-sidebar.component';

describe('OwnerSidebarComponent', () => {
  let component: OwnerSidebarComponent;
  let fixture: ComponentFixture<OwnerSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerSidebarComponent]
    });
    fixture = TestBed.createComponent(OwnerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
