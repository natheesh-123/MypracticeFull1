import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { Router } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { saveUserData } from '../../../store/user/user.actions';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {PermissionList} from '../../../common/commondate'
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-edit-permissions',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-permissions.component.html',
  styleUrl: './edit-permissions.component.css'
})
export class EditPermissionsComponent {

  private userstore = inject(Store<{user:UserState}>)
      public user:any;  
      Roles:any = [];
      givepermissionForm:any;
      addpermissionforID:any;
      PermissionList:any = PermissionList;
    
      constructor(private _route:Router, private _http:DbservicesService){}
    
      ngOnInit(){
        this.userstore.select(state => state.user).subscribe(data => this.user=data);
    
        if(!this.user.permissions.includes("EditPermissions"))
          this._route.navigate(['/']);
        else
          this.getPermissionsDetails();

        
        this.givepermissionForm = new FormGroup({
          roleSelect: new FormControl("", [Validators.required]),
          permissionSelect: new FormControl("", [Validators.required]),
        })
        
      }


      getPermissionsDetails(){
        this._http.getRecord("role").subscribe(
          (res) => {
            this.Roles = res;
            this.Roles = this.Roles.map(
              (role:any)=>{
                return {...role,permissions:role.permissions.map((val:any)=>{return val.permissionName})}
              })
          },
          (error)=>{
            addMessage({type:"failure", message:"Error Getting Data From Server"});
          }
        )
      }

      AddPermission(){
        var hasPermission:Boolean = false;
        const formDetails:any = this.givepermissionForm.value;
        var permission:any ={roleId:"", permissionName:""}

        this.Roles.map((role:any)=>{
          if(role.roleName == formDetails.roleSelect){
            this.addpermissionforID = role.id;       
            if(role.permissions.includes(formDetails.permissionSelect))
            {
              hasPermission = true;       
            }
          }
        });

        if(hasPermission){
          addMessage({type:"warning", message:`${formDetails.roleSelect} already have that permission`});
        }
        else{
          permission.permissionName = formDetails.permissionSelect;
          permission.roleId = this.addpermissionforID;
          this._http.postRecord(`permission`,permission).subscribe(
            (res) => {
              addMessage({type:"success", message:"Permission Added"});
              this.getPermissionsDetails();
            },
            (error) => {
              addMessage({type:"success", message:"Unable to Give Permission"});
            }
          );
        }
      }
      
      UpdatePermission(){
        var hasPermission:Boolean = false;
        const formDetails:any = this.givepermissionForm.value;

        this.Roles.map((role:any)=>{
          if(role.roleName == formDetails.roleSelect){
            this.addpermissionforID = role.id;       
            if(role.permissions.includes(formDetails.permissionSelect))
            {
              hasPermission = true;       
            }
          }
        });

        if(!hasPermission){
          addMessage({type:"warning", message:"This Permission Not given"});
        }
        else{
          this._http.deleteRecord(`permission/${formDetails.permissionSelect}?roleid=${this.addpermissionforID}`).subscribe(
            (res)=>{
              addMessage({type:"success", message:`Permission Deleted for ${formDetails.roleSelect}`});
              this.getPermissionsDetails();
            },
            (error) => {
              addMessage({type:"failure", message:`Unable to Deleted permission`});
            }
          )
        }
        
      }
}
