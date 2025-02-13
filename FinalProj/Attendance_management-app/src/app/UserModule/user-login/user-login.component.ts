import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { saveUserData } from '../../../store/user/user.actions';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-user-login',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {

  LoginForm:any;
  User:any = {
    id:0,
    name:"",
    email:"",
    role:"",
    permissions:[],
    profilepicture:"",
}
  LData:any;
  reqUrl:any;

  private userstore = inject(Store<{user:UserState}>)

  constructor(private _http : DbservicesService, private _route:Router){}

  ngOnInit(){
    this.LoginForm = new FormGroup({
      id:new FormControl("", [Validators.required, Validators.pattern("^[0-9]{3,4}$")]),
      password:new FormControl("", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")])
    })

    this._http.getRecord('Attendance/isOnline').subscribe(
      (res:any) => {
        addMessage({type:"success", message:"Server Online"});
      },
      (error:any) => {
        addMessage({type:"failure", message:"Server Offline"});
      }
    )

    
  }

  AuthenticateUser(){
    this.LData = this.LoginForm.value;
    this.reqUrl = `user/${this.LData.id}/verify?password=${this.LData.password}`;

    this._http.getRecord(this.reqUrl).subscribe(
      (res)=>{
        if(res){
          addMessage({type:"success", message:"Loged In"});
          this.LogginSequence();
        }
        else{
          addMessage({type:"failure", message:"Wrong Password"});
        }
      },
      (error)=>{
        addMessage({type:"failure", message:"User Not Found"});
      }
    )

  }

  LogginSequence(){
    this.reqUrl = `user/${this.LData.id}`;
    var userData:any;
    var permissions:any[] = [];

    this._http.getRecord(this.reqUrl).subscribe(
      (res) => {
        userData = res;
        this.reqUrl = `permission/${userData.role}`
        this._http.getRecord(this.reqUrl).subscribe(
          (res) => {
              permissions = Object.values(res).map((item:any)=>item.permissionName);

              this.User = {
                id:userData.id,
                name:userData.name,
                email:userData.email,
                password:userData.password,
                role:userData.role,
                permissions:permissions,
                profilepicture:userData.profilePicture,
                createdat:userData.createdAt,
              }
              this.userstore.dispatch(saveUserData(this.User));
              localStorage.setItem('user', JSON.stringify(this.User));
              setTimeout(() => {
                this._route.navigate(["/dashboard"]);
              }, 1000);
          },
          (error) => {addMessage({type:"failure", message:"Error Getting Data From Server"});}
        )
      },
      (error) => {addMessage({type:"failure", message:"Error Getting Data From Server"});}
    )    
  }

  validate(formcontrolname:any){
    if(formcontrolname == "id"){
      if(this.LoginForm.get("id").invalid){
        if(this.LoginForm.get("id").errors.pattern){
          addMessage({type:"warning", message:"Id is a 3 or 4 Digit Number"});
        }
        if(this.LoginForm.get("id").errors.required){
          addMessage({type:"warning", message:"id Field is Requied"});
        }
      }
    }
    else if(formcontrolname == "password"){
      if(this.LoginForm.get("password").invalid){
        if(this.LoginForm.get("password").errors.pattern){
          addMessage({type:"warning", message:"InValid Password"});
        }
        if(this.LoginForm.get("password").errors.required){
          addMessage({type:"warning", message:"Password Field is Requied"});
        }
      }
    }
    
  }


  
}
