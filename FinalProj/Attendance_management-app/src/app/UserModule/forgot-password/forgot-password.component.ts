import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  ForgotPasswordForm:any;
  newPasswordForm:any;
  User:any;
  FPdata:any;
  isVerifiedUser:boolean = false;
  
  
  constructor(private _http : DbservicesService, private _route:Router){}

  ngOnInit(){
    this.ForgotPasswordForm = new FormGroup({
      id:new FormControl("", [Validators.required, Validators.pattern("^[0-9]{3,4}$")]),
      email:new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")])
    }) 
    this.newPasswordForm = new FormGroup({
      password:new FormControl("", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),
      confirmpassword:new FormControl("", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")      ]),
    }) 
  }

  VerifyUser(){
    this.FPdata = this.ForgotPasswordForm.value;

    this._http.getRecord(`User/${this.FPdata.id}`).subscribe(
      (res:any)=>{
        addMessage({type:"success", message:"Found User"});
        if(this.FPdata.email == res.email){
          addMessage({type:"success", message:"User Verifies"});
          this.User = res;
          this.isVerifiedUser = true;
        }
        else{
          addMessage({type:"failure", message:"Verification Failed"});
        }
      },
      (error)=>{
        addMessage({type:"failure", message:"No User Found"});
      }
    )

  }

  ChangePassword(){
    if(this.newPasswordForm.value.confirmpassword != this.newPasswordForm.value.password)
    {
      addMessage({type:"warning", message:"Passwords Not Same"});
      return;
    }
    this.User = {
      id:this.User.id,
      name:this.User.name,
      email:this.User.email,
      password:this.newPasswordForm.value.password,
      role:this.User.password,
      profilePicture:this.User.profilePicture
    }
   
    this._http.updateRecord(`User/${this.User.id}`, this.User).subscribe(
      (res)=>{
        addMessage({type:"success", message:"Password Updated"});
        setTimeout(() => {
          this._route.navigate(['/']);          
        }, 2000);
      },
      (error)=>{
        addMessage({type:"failure", message:"Unable to Update Password"});
      }
    )
  }

  validate1(formcontrolname:any){
    if(formcontrolname == "id"){
      if(this.ForgotPasswordForm.get("id").invalid){
        if(this.ForgotPasswordForm.get("id").errors.pattern){
          addMessage({type:"warning", message:"Id is a 3 or 4 Digit Number"});
        }
        if(this.ForgotPasswordForm.get("id").errors.required){
          addMessage({type:"warning", message:"id Field is Requied"});
        }
      }
    }
    else if(formcontrolname == "email"){
      if(this.ForgotPasswordForm.get("email").invalid){
        if(this.ForgotPasswordForm.get("email").errors.pattern){
          addMessage({type:"warning", message:"InValid Email"});
        }
        if(this.ForgotPasswordForm.get("email").errors.required){
          addMessage({type:"warning", message:"Email is Requied"});
        }
      }
    }
  }

  validate2(formcontrolname:any){
    if(formcontrolname == "password"){
      if(this.newPasswordForm.get("password").invalid){
        if(this.newPasswordForm.get("password").errors.pattern){
          addMessage({
            type:"warning", 
            message:"Password should have Lower, Upper, Digits, Special Characters "});
        }
        if(this.newPasswordForm.get("password").errors.required){
          addMessage({type:"warning", message:"Password Field is Requied"});
        }
      }
    }
    else if(formcontrolname == "confirmpassword"){
      if(this.newPasswordForm.get("confirmpassword").invalid){
        if(this.newPasswordForm.get("confirmpassword").errors.pattern){
          addMessage({
            type:"warning", 
            message:"Password should have Lower, Upper, Digits, Special Characters "});
        }
        if(this.newPasswordForm.get("confirmpassword").errors.required){
          addMessage({type:"warning", message:"Confirm Password Field is Requied"});
        }
      }
    }
    
  }

}
