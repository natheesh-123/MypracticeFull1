import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestHistoryComponent } from './leave-request-history.component';

describe('LeaveRequestHistoryComponent', () => {
  let component: LeaveRequestHistoryComponent;
  let fixture: ComponentFixture<LeaveRequestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
