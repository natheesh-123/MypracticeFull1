import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherAttendanceComponent } from './view-teacher-attendance.component';

describe('ViewTeacherAttendanceComponent', () => {
  let component: ViewTeacherAttendanceComponent;
  let fixture: ComponentFixture<ViewTeacherAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeacherAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTeacherAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
