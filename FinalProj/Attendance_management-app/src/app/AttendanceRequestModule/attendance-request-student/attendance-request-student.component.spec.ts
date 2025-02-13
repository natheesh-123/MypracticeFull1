import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRequestStudentComponent } from './attendance-request-student.component';

describe('AttendanceRequestStudentComponent', () => {
  let component: AttendanceRequestStudentComponent;
  let fixture: ComponentFixture<AttendanceRequestStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRequestStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRequestStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
