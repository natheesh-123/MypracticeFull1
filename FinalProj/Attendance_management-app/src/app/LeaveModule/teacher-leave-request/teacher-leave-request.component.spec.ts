import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLeaveRequestComponent } from './teacher-leave-request.component';

describe('TeacherLeaveRequestComponent', () => {
  let component: TeacherLeaveRequestComponent;
  let fixture: ComponentFixture<TeacherLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherLeaveRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
