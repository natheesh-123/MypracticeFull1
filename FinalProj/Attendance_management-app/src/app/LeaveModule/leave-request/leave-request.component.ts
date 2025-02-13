import { HttpClient } from '@angular/common/http';
import { Component,inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DbservicesService } from '../../services/db/dbservices.service'; 
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { addMessage } from '../../../common/popupmessage';


@Component({
  selector: 'app-leave-request',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css'
})
export class LeaveRequestComponent {
  private userstore = inject(Store<{user:UserState}>);
  public user:any;

  leaveForm: FormGroup;
  LeaveTypes: any;
  MinDate:any;  

  leaverequestCount:any;
  leavehistoryCount:any;

  constructor(private http: DbservicesService, private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      leaveTypeId: [null, Validators.required],
      Date: [null, Validators.required],
      reason: ['', Validators.required]
    });

    this.http.getRecord("User/getDate").subscribe(
      (res:any)=>{this.MinDate=res.date;}
    )
  }

  ngOnInit(): void {
    this.userstore.select(state => state.user).subscribe(date => this.user=date);

    this.http.getRecord('LeaveTypes').subscribe((data:any) => {
      this.LeaveTypes = data;
    });


  }

  

  submitLeaveRequest() {
    var newLeaveRequest = {
      userId:this.user.id,
      leaveTypeId: this.leaveForm.value.leaveTypeId,
      date: this.leaveForm.value.Date,
      status: 'Pending',
      reason: this.leaveForm.value.reason
    };

    this.http.getRecord(`Attendance/check/${this.user.id}?Date=${newLeaveRequest.date}`).subscribe(
      (res:any) => {
        if(res){
          this.http.getRecord(`Attendancerequest/check/${this.user.id}?Date=${newLeaveRequest.date}`).subscribe(
            (attendanceRequest:any) => {
              if(attendanceRequest){
                this.http.getRecord(`Leaverequest/check/${this.user.id}?Date=${newLeaveRequest.date}`).subscribe(
                  (leaveRequest:any) => {
                    if(leaveRequest){
                      this.http.getRecord(`Leaverequest/Countleaves/${this.user.id}?Date=${newLeaveRequest.date}`).subscribe(
                        (res:any)=>{
                          this.leaverequestCount = res.count
                          addMessage({type:"warning", message:`Leave Requests ${this.leaverequestCount}`});
                          this.http.getRecord(`Leaverequestshistory/Countleaves/${this.user.id}?Date=${newLeaveRequest.date}`).subscribe(
                            (res:any)=>{
                              this.leavehistoryCount = res.count;
                              addMessage({type:"warning", message:`Leaves ${this.leavehistoryCount}`});
                              
                              if((this.leavehistoryCount+this.leaverequestCount) >= 2 ){
                                addMessage({type:"warning", message:`Leave Limit Reached`});
                              }
                              else{
                                setTimeout(() => {
                                  this.http.postRecord('LeaveRequest', newLeaveRequest)
                                  .subscribe(() => {
                                    addMessage({type:"warning", message:`Leave Requests ${this.leaverequestCount+=1}`});
                                      alert('Leave Request Submitted!');
                                    });                                  
                                }, 1000);
                              }

                            }
                          )
                        }
                      )
                    }
                  }
                );    
              }
            }
          );
        }
      }
    );
  }
}
