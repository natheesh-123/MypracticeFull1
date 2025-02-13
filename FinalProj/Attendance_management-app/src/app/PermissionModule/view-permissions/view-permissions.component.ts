import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { Router } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { saveUserData } from '../../../store/user/user.actions';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {PermissionList} from '../../../common/commondate'

@Component({
  selector: 'app-view-permissions',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './view-permissions.component.html',
  styleUrl: './view-permissions.component.css'
})
export class ViewPermissionsComponent {

  private userstore = inject(Store<{user:UserState}>)
      public user:any;  
      Roles:any = [];
      PermissionList:any = PermissionList;
    
      constructor(private _route:Router, private _http:DbservicesService){}
    
      ngOnInit(){
        this.userstore.select(state => state.user).subscribe(data => this.user=data);
    
        if(!this.user.permissions.includes("ViewPermissions"))
          this._route.navigate(['/']);
        else
          this.getPermissionsDetails();
        
      }


      getPermissionsDetails(){
        this._http.getRecord("role").subscribe(
          (res) => {
            this.Roles = res;
            this.Roles = this.Roles.map(
              (role:any)=>{
                return {...role,permissions:role.permissions.map((val:any)=>{return val.permissionName})}
              })
          }
        )
      }

}
