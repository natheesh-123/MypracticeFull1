import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { Router } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {PermissionList} from '../../../common/commondate'
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-view-roles',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './view-roles.component.html',
  styleUrl: './view-roles.component.css'
})
export class ViewRolesComponent {

  private userstore = inject(Store<{user:UserState}>)
  public user:any;  
  Roles:any = [];
  CanEdit:any = false;
  editingValueForId:any = -1;
  editingValueForName:any = "";
  roleEditForm:any;
  addpermissionforID:any;
  PermissionList:any = PermissionList;
  isAddingNewRole:boolean = false;

  constructor(private _route:Router, private _http:DbservicesService){}

  ngOnInit(){
    this.userstore.select(state => state.user).subscribe(data => this.user=data);
    
    if(this.user.permissions.includes("EditRoles")){
      this.CanEdit = true;
    } 

    if(!this.user.permissions.includes("ViewRoles"))
      this._route.navigate(['/']);
    else
      this.getRoles();
    
    this.roleEditForm = new FormGroup({
      roleId : new FormControl("", [Validators.required]),
      roleName : new FormControl("", [Validators.required])
    });
    
  }


  getRoles(){
    this._http.getRecord("role/onlyroles").subscribe(
      (res) => {
        this.Roles = res;
      }
    )
  }

  changeEdit(roleid:any){
    

    this.editingValueForId = roleid;
    
    this.Roles.map((role:any)=>{
      if(role.id == roleid)
        this.editingValueForName = role.roleName
    })

    const EditRole = {roleId:roleid, roleName:this.editingValueForName }; 
    this.roleEditForm.patchValue(EditRole);
  }

  UpdateRole(){
    if(!confirm("Are you sure you want to update the Roles")){
      this.editingValueForId = -1;
      return;
    }
    
    const editDetails:any = this.roleEditForm.value;

    if(this.editingValueForId==editDetails.roleId && this.editingValueForName==editDetails.roleName){
      addMessage({type:"warning", message:"No Changes Found"});
      this.editingValueForId = -1;
      return;
    }
    const updatedRole:any = {
      id:editDetails.roleId,
      roleName:editDetails.roleName
    }
    this._http.updateRecord(`role/${this.editingValueForId}`, updatedRole).subscribe(
      (res)=>{
        addMessage({type:"success", message:"Role Updates"});
        this.getRoles();
        this.editingValueForId = -1;
      },
      (error) => {
        addMessage({type:"failure", message:"Error Updating"});
      }
    )
  }


  deleteRole(roleid:any){
    if(!confirm("Are you sure you want to Delete the Roles")){
      return;
    }

    this._http.deleteRecord(`role/${roleid}`).subscribe(
      (res)=>{
        addMessage({type:"success", message:"Role Deleted"});
        this.getRoles();
      },
      (error)=>{
        addMessage({type:"failure", message:"Error Deleting"});
      }
    )
  }


  changeroAddRole(){
    this.editingValueForId = -1;
    this.isAddingNewRole = true;
  }

  addRole(){
    var newRole = {
      roleName:this.roleEditForm.value.roleName
    }
    this._http.postRecord("role", newRole).subscribe(
      (res)=>{
        addMessage({type:"success", message:"Role Added"});
        this.isAddingNewRole = false;
        this.getRoles();
      },
      (error)=>{
        addMessage({type:"failure", message:"Failed to Add"});
      }
    );
  }

}
