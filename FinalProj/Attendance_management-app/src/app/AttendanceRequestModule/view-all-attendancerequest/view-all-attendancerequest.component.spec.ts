import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllAttendancerequestComponent } from './view-all-attendancerequest.component';

describe('ViewAllAttendancerequestComponent', () => {
  let component: ViewAllAttendancerequestComponent;
  let fixture: ComponentFixture<ViewAllAttendancerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllAttendancerequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllAttendancerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
