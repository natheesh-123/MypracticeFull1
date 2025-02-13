import { Component } from '@angular/core';
import { DbservicesService } from '../../services/db/dbservices.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
	import { Store } from '@ngrx/store';
	import { UserState } from '../../../store/user/user.state';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-leave-request-history',
  imports: [CommonModule,FormsModule],
  templateUrl: './leave-request-history.component.html',
  styleUrl: './leave-request-history.component.css'
})
export class LeaveRequestHistoryComponent {
  private userstore = inject(Store<{user:UserState}>);
  	public user:any;
  leaveRequests: any;
  newRequest = { userName: '', leaveType: '', date: '', reason: '' };

  constructor(private _route:Router, private _http: DbservicesService){}

  ngOnInit(): void {
    this.userstore.select(state => state.user).subscribe(data => this.user=data);

    if(!this.user.permissions.includes("LeaveRequestHistory"))
      this._route.navigate(['/']);
    else
    this.fetchAllRequests();
  }

  // Fetch all leave requests
  fetchAllRequests() {
    this._http.getRecord(`LeaveRequest/${this.user.id}`)
      .subscribe((data) => {
        this.leaveRequests = data;
      });
  }


  deleteLeaveHistory(requestId: number) {
    if (confirm("Are you sure you want to delete this leave request?")) {
      this._http.deleteRecord(`LeaveRequest/${requestId}`)
        .subscribe(() => {
          addMessage({type:"success", message:"Request Deleted"});
          this.fetchAllRequests();
        });
    }
  }
}
