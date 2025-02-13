import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { saveUserData } from '../../../store/user/user.actions';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PermissionList} from '../../../common/commondate'

@Component({
  selector: 'app-user-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  public PermissionList = PermissionList;
  private userstore = inject(Store<{user:UserState}>)
   public user:any;
 
   constructor(private _route:Router){}
   
   ngOnInit(){
     this.userstore.select(state => state.user).subscribe(date => this.user=date);

     
   }
}
