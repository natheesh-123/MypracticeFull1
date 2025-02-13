import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRequestTeacherComponent } from './attendance-request-teacher.component';

describe('AttendanceRequestTeacherComponent', () => {
  let component: AttendanceRequestTeacherComponent;
  let fixture: ComponentFixture<AttendanceRequestTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRequestTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRequestTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
