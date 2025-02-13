import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbservicesService } from '../../services/db/dbservices.service'; 
import { addMessage } from '../../../common/popupmessage';
import { inject } from '@angular/core';
	import { Store } from '@ngrx/store';
	import { UserState } from '../../../store/user/user.state';
import { Router } from '@angular/router';

	
  
  
  @Component({
    selector: 'app-attendance-mark',
    imports: [CommonModule,FormsModule],
    templateUrl: './attendance-mark.component.html',
    styleUrl: './attendance-mark.component.css'
  })
  export class AttendanceMarkComponent  {
    private userstore = inject(Store<{user:UserState}>);
  	public user:any;
    
    attendanceDate:any; 
    status: string ='Present';
    canGiveAttendance:boolean = false;
    
    constructor(private attendancemark: DbservicesService, private route:Router) {}
    
      
  ngOnInit(){
    this.userstore.select(state => state.user).subscribe(date => this.user=date);
    this.attendancemark.getRecord("User/getDate").subscribe(
      (res:any)=>{
        this.attendanceDate=res.date;

        this.checkAttendance();

      },
      (error)=>{
        addMessage({type:"failure", message:"Error Getting Date"});
        setTimeout(() => {
          this.route.navigate(['/']);
        }, 1000);
      }
    )
  }

  checkAttendance(){
    this.attendancemark.getRecord(`Attendancerequest/check/${this.user.id}?date=${this.attendanceDate}`).subscribe(
      (attendanceRequestExists:any) => { 
        if (!attendanceRequestExists) { 
          addMessage({type:"warning", message:"You have requested attendance for the day."});
          return; 
        }
        
        
        this.attendancemark.getRecord(`Attendance/check/${this.user.id}?date=${this.attendanceDate}`).subscribe(
          (attendanceExists:any) => { 
            if (!attendanceExists) { 
              addMessage({type:"warning", message:"You already have attendance for the day."});
              return; 
            }
            
            
            this.attendancemark.getRecord(`LeaveRequest/check/${this.user.id}?date=${this.attendanceDate}`).subscribe(
              (leaveRequestExists:any) => { 
                if (!leaveRequestExists) { 
                  addMessage({type:"warning", message:"You have a Leave Request for the day."});
                  return; 
                }
                
                this.canGiveAttendance = true;
                
              },
              (error) => {
                addMessage({type:"failure", message:"Unable to Check Leave Requests"});
              }
            );
          },
          (error) => {
            addMessage({type:"failure", message:"Unable to Check Attendance History"});
          }
        );
      },
      (error) => {
        addMessage({type:"failure", message:"Unable to Check Attendance Requests"});
      }
    );
    
    
  }

  
  submitAttendance() {
    const attendanceData = {
      date: this.attendanceDate,
      userId: this.user.id,
      status: this.status
    };
    
    this.attendancemark.postRecord(`Attendancerequest`, attendanceData).subscribe({
      next: () => {
        addMessage({type:"success", message:"Attendance Requested"});
        this.canGiveAttendance = false;
      },
      error: (error: any) => {
        addMessage({type:"failure", message:"Attendance Request Failed"});
      }
    });
  }




}
