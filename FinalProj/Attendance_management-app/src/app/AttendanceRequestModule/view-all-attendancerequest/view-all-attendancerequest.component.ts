import { Component } from '@angular/core';
import { DbservicesService } from '../../services/db/dbservices.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-all-attendancerequest',
  imports: [CommonModule,FormsModule],
  templateUrl: './view-all-attendancerequest.component.html',
  styleUrl: './view-all-attendancerequest.component.css'
})
export class ViewAllAttendancerequestComponent {


  allattendanceRequests: any[] = [];

  constructor(private allAttendanceReq: DbservicesService) { }

  ngOnInit(): void {
    this.loadAttendanceRequests();
  }

  loadAttendanceRequests(): void {
    this.allAttendanceReq.getRecord('Attendancerequest').subscribe(
      (data:any) => {
        this.allattendanceRequests = data;
      },
      (error:any) => {
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
      remarks:null 
    };
    console.log('Attendance request updated successfully', updatedData);

    
    this.allAttendanceReq.postRecord('Attendance', updatedData).subscribe(
      (response: any) => {
        console.log('Attendance request updated successfully', response);

       
        this.allAttendanceReq.deleteRecord(`Attendancerequest/${request.id}`).subscribe(
          (deleteResponse: any) => {
            console.log('Attendance request deleted successfully', deleteResponse);
           
            this.loadAttendanceRequests();
          },
          (deleteError: any) => {
            console.error('Error deleting attendance request', deleteError);
          }
        );

      }
    );

  }



  onReject(request: any): void {
    console.log('Submitting request:', request);



    this.allAttendanceReq.deleteRecord(`Attendancerequest/${request.id}`).subscribe(
      (deleteResponse: any) => {
        console.log('Attendance request deleted successfully', deleteResponse);
       
        
    const updatedData = {
      userId: request.userId,
      date: request.date,
      status: 'Absent',
      remarks:null 
    };
    console.log('Attendance request updated successfully', updatedData);



        this.allAttendanceReq.postRecord('Attendance', updatedData).subscribe(
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
