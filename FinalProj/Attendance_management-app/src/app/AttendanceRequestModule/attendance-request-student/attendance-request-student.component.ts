import { Component, OnInit } from '@angular/core';
import { DbservicesService } from '../../services/db/dbservices.service'; 
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-attendance-request-student',
  imports: [CommonModule],
  templateUrl: './attendance-request-student.component.html',
  styleUrl: './attendance-request-student.component.css'
})
export class AttendanceRequestStudentComponent implements OnInit {

  attendanceRequests: any[] = [];

  constructor(private attendanceReqstudent: DbservicesService) { }

  ngOnInit(): void {
    this.loadAttendanceRequests();
  }

  loadAttendanceRequests(): void {
    this.attendanceReqstudent.getRecord('Attendancerequest/byrole?role=Student').subscribe(
      (data: any) => {
        this.attendanceRequests = data;
      },
      (error: any) => {
        console.error('Error fetching attendance requests', error);
      }
    );
  }

  onSubmit(request: any): void {
    console.log('Submitting request:', request);


    const updatedData = {
      userId: request.userId,
      date: request.date,
      status: 'present',
      remarks: null
    };
    console.log('Attendance request updated successfully', updatedData);


    this.attendanceReqstudent.postRecord('Attendance', updatedData).subscribe(
      (response: any) => {
        console.log('Attendance request updated successfully', response);


        this.attendanceReqstudent.deleteRecord(`Attendancerequest/${request.id}`).subscribe(
          (deleteResponse: any) => {
            console.log('Attendance request deleted successfully', deleteResponse);

            this.loadAttendanceRequests();
          },
          (deleteError: any) => {
            console.error('Error deleting attendance request', deleteError);
          }
        );


        this.loadAttendanceRequests();
      },
      (error: any) => {
        console.error('Error updating attendance request', error);
      }
    );

  }




  onReject(request: any): void {
    console.log('Submitting request:', request);



    this.attendanceReqstudent.deleteRecord(`Attendancerequest/${request.id}`).subscribe(
      (deleteResponse: any) => {
        console.log('Attendance request deleted successfully', deleteResponse);


        const updatedData = {
          userId: request.userId,
          date: request.date,
          status: 'Absent',
          remarks: null
        };
        console.log('Attendance request updated successfully', updatedData);



        this.attendanceReqstudent.postRecord('Attendance', updatedData).subscribe(
          (response: any) => {
            console.log('Attendance request updated successfully', response);



          }
        );


        this.loadAttendanceRequests();
      },
      (deleteError: any) => {
        console.error('Error deleting attendance request', deleteError);
      }
    );


  }





}
