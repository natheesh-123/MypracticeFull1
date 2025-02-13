import { Component } from '@angular/core';
import { DbservicesService } from '../../services/db/dbservices.service'; 
import { CommonModule } from '@angular/common';
import { addMessage } from '../../../common/popupmessage';
import { inject } from '@angular/core';
	import { Store } from '@ngrx/store';
	import { UserState } from '../../../store/user/user.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-leave-request',
  imports: [CommonModule],
  templateUrl: './all-leave-request.component.html',
  styleUrl: './all-leave-request.component.css'
})
export class AllLeaveRequestComponent {
  private userstore = inject(Store<{user:UserState}>);
      public user:any;
  
    leaveRequests: any;
    isAttendanceMarked: boolean=false;
  
    constructor(private _route:Router,private http: DbservicesService) {}
  
    ngOnInit(): void {
      this.userstore.select(state => state.user).subscribe(date => this.user=date);
  
      if(!this.user.permissions.includes("AllLeaveRequest"))
        this._route.navigate(['/']);
      else
        this.fetchStudentRequests();
  
    }
  
    fetchStudentRequests() {
      this.http.getRecord('LeaveRequest?role=null')
        .subscribe((data) => {
          this.leaveRequests = data;
        });
    }
  
    
    updateLeaveStatus(request: any, status: string,) {
      if(status === 'Leave'){
        var requrl = `Attendance/check/${request.user.id}?date=${request.date}`;
        this.http.getRecord(requrl)
          .subscribe(isAttendanceMarked => {
            if (isAttendanceMarked === false) {
              addMessage({type:"warning", message:"Attendance already exists for this user on this date"});
              return;
            }
      
            const newAttance = { 
              userId: request.user.id,
              remarks: request.reason,
              status:status,
              date: request.date
             };
      
            this.http.postRecord(`Attendance/`, newAttance)
              .subscribe(() => {
                var newLeaveRequestHistory = {
                  userId: request.user.id,
                  leaveTypeId:request.leaveTypeId,
                  date:request.date,
                  status: "Accepted",
                  reason: request.reason,
                }
                this.http.postRecord(`LeaveRequestsHistory`, newLeaveRequestHistory).subscribe(
                  (data) => {
                    this.deleteLeaveRequest(request.id, "Accepted");
                  },
                  (error) => {
                    addMessage({type:"failure", message:"Unable to save Leave Request"});
                  }
                );
                
              }, (error: any) => {
                addMessage({type:"failure", message:"Error Adding Attendance"});
              });
            });
          }
          else if(status==='Rejected'){
        var newLeaveRequestHistory = {
          userId: request.user.id,
          leaveTypeId:request.leaveTypeId,
          status: "Rejected",
          reason: request.reason,
        }
        this.http.postRecord(`LeaveRequestsHistory`, newLeaveRequestHistory).subscribe(
          (data) => {
            this.deleteLeaveRequest(request.id, "Rejected");
          },
          (error) => {
            addMessage({type:"failure", message:"Error Adding Request History"});
          }
        );
      }
    }
    
  
  // Delete leave request
  deleteLeaveRequest(requestId: number, message:string) {
    this.http.deleteRecord(`LeaveRequest/${requestId}`)
      .subscribe(() => {
        addMessage({type:"success", message:`Request ${message}`});
        this.fetchStudentRequests();
      }, (error: any) => {
        addMessage({type:"failed", message:`Unable to remove rquest`});
      });
  }

}
