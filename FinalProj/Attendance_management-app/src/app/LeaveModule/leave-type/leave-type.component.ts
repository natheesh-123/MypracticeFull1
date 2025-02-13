import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { inject } from '@angular/core';
	import { Store } from '@ngrx/store';
	import { UserState } from '../../../store/user/user.state';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-leave-type',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './leave-type.component.html',
  styleUrl: './leave-type.component.css',
})
export class LeaveTypeComponent implements OnInit {
  private userstore = inject(Store<{user:UserState}>);
  	public user:any;
  leaveTypes: any[] = [];
  leaveForm!: FormGroup;
  showLeaveForm = false;
  isEditing = false;
  selectedLeaveType: any = {};
  changingId:any;

  canEditRole:boolean = false;

  constructor(private fb: FormBuilder, private dbService: DbservicesService,private _route:Router) {}

  ngOnInit() {
    this.userstore.select(state => state.user).subscribe(data => this.user=data);

    if(!this.user.permissions.includes("ViewLeaveTypes"))
      this._route.navigate(['/']);
    else{
      this.initializeForm();
      this.loadLeaveTypes();
    }

    if(this.user.permissions.includes("EditLeaveTypes")){
      this.canEditRole = true;
    }

  }

  initializeForm() {
    this.leaveForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  loadLeaveTypes() {
    console.log('Loading Leave Types...');
    this.dbService.getRecord('LeaveTypes').subscribe(
      (data: any) => {
        this.leaveTypes = data.map((leave: any) => ({
          ...leave,
          created_at: new Date(leave.createdAt),
          updated_at: new Date(leave.updatedAt),
        }));
      },
      (error:any) => addMessage({type:"failure", message:"Server Offline"})
    );
  }

  saveLeaveType() {
    this.selectedLeaveType = this.leaveForm.value;
    if (this.isEditing) {
      this.dbService.updateRecord(`LeaveTypes/${this.changingId}`, this.selectedLeaveType)
        .subscribe(
          () => {
            addMessage({type:"success", message:"Type Updates Successfully"});
            this.loadLeaveTypes();
          },
          (error: any) => addMessage({type:"failure", message:"Failes to Update"})
        );
      } else {
        this.dbService.postRecord('LeaveTypes', this.selectedLeaveType)
        .subscribe(
          () =>{
            addMessage({type:"success", message:"Type Added Successfully"});
            this.loadLeaveTypes();
          },
          (error:any) => addMessage({type:"failure", message:"Failes to Add"})
        );
    }
    this.cancelEdit();
  }

  editLeaveType(leaveType: any) {
    this.isEditing = true;
    this.selectedLeaveType = { ...leaveType };

    this.leaveForm.patchValue({
      name: leaveType.name,
      description: leaveType.description
    });
    this.changingId = leaveType.id;
  }

  deleteLeaveType(id: number) {
    if (confirm('Are you sure you want to delete this leave type?')) {
      this.dbService.deleteRecord(`LeaveTypes/${id}`)
        .subscribe(
          () => {
            addMessage({type:"success", message:"Type Deleted Successfully"});
            this.loadLeaveTypes();
          },
          (error:any) => addMessage({type:"failure", message:"Failes to Delete"})
        );
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedLeaveType = {};
    this.leaveForm.reset();
  }
}
