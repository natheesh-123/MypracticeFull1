import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule , ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { DbservicesService } from '../../services/db/dbservices.service';
import { Router, RouterLink } from '@angular/router';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-user-registration',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {

  selectedFile:any;
  regForm:any;
  roles:any = [];
  hasUploadedProfileImage:Boolean = false;
  isNotUploadingProfileImage:boolean = false;
  
showPassword: any;

  profilePic:string = "ProfilePhotoPlaceholder.png";

  constructor(private http : DbservicesService, private _route:Router){}

  ngOnInit():void{
    this.regForm = new FormGroup({
      id:new FormControl("",[Validators.required,Validators.pattern("^[0-9]{3,4}$")]),
      name:new FormControl("",[Validators.required, Validators.pattern("^[a-zA-Z ]{3,20}$")]),
      email:new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
      password:new FormControl("",[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),
      role:new FormControl("", [Validators.required, ])
    })

    this.http.getRecord("role/onlyroles").subscribe(
    (res)=>{
      this.roles = res;
    },
    (error)=>{
      addMessage({type:"failure", message:"Error Getting Data From Server"});
    }
  )
  }

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onUpload() {
    if (!this.selectedFile) return;
  
    const fileExtension = this.selectedFile.name.split('.').pop();
    if(fileExtension != "jpg") return;

    const formData = new FormData();
    formData.append('file', this.selectedFile, `${this.regForm.value.id}.${fileExtension}`);
  
    // Send the file to the server
    this.http.postRecord("Image/Upload", formData).subscribe(
      (response: any) => {
        addMessage({type:"success", message:"Image uploaded"});
        this.profilePic = `${this.http.baseURL}/Image/Get/${this.regForm.value.id}.jpg`;
        this.hasUploadedProfileImage = true;
        this.isNotUploadingProfileImage=false;
      },
      (error: any) => {
        addMessage({type:"failure", message:"Upload Failed"});
      }
    );
  }
  
  registerUser(){
    this.http.getRecord(`User/${this.regForm.value.id}`).subscribe(
      (response:any) => {
        addMessage({type:"warning", message:"You are already a User"});
        return;
      },
      (error:any) => {
        console.log("New User");
        this.http.getRecord(`Usersregistration/${this.regForm.value.id}`).subscribe(
          (response:any) => {
            addMessage({type:"warning", message:"You have already registered"});
            return;
          },
          (error:any) => {

            let fileName:string;
            if(this.isNotUploadingProfileImage)
              fileName = `ProfilePhotoPlaceholder.jpg`;
            else
              fileName = `${this.regForm.value.id}.jpg`;

            let user = {
              "id":this.regForm.value.id,
              "name": this.regForm.value.name,
              "email": this.regForm.value.email,
              "password": this.regForm.value.password,
              "role": this.regForm.value.role,
              "profilePicture":fileName};
        
        
            this.http.postRecord('Usersregistration', user).subscribe(
              (response:any) => {
                this.onUpload();
                addMessage({type:"success", message:"User Registered Successfully"});
                setTimeout(() => {
                  this._route.navigate(['/']);                  
                }, 1500);
              },
              (error:any) => {
                addMessage({type:"failure", message:"Failed To Register"});
              }
            );


          }
        );
      }
    );
    
  }



  validate(formcontrolname:any){
    if(formcontrolname == "id"){
      if(this.regForm.get("id").invalid){
        if(this.regForm.get("id").errors.pattern){
          addMessage({type:"warning", message:"Id is a 3 or 4 Digit Number"});
        }
        if(this.regForm.get("id").errors.required){
          addMessage({type:"warning", message:"id Field is Requied"});
        }
      }
    }
    else if(formcontrolname == "password"){
      if(this.regForm.get("password").invalid){
        if(this.regForm.get("password").errors.pattern){
          addMessage({
            type:"warning", 
            message:"Password should have Lower, Upper, Digits, Special Characters "});
        }
        if(this.regForm.get("password").errors.required){
          addMessage({type:"warning", message:"Password Field is Requied"});
        }
      }
    }
    else if(formcontrolname == "email"){
      if(this.regForm.get("email").invalid){
        if(this.regForm.get("email").errors.pattern){
          addMessage({type:"warning", message:"InValid Email"});
        }
        if(this.regForm.get("email").errors.required){
          addMessage({type:"warning", message:"Email is Requied"});
        }
      }
    }
    else if(formcontrolname == "name"){
      if(this.regForm.get("name").invalid){
        if(this.regForm.get("name").errors.pattern){
          addMessage({type:"warning", message:"Name should be 3 - 20 characters"});
        }
        if(this.regForm.get("name").errors.required){
          addMessage({type:"warning", message:"Name Field is Requied"});
        }
      }
    }
    
  }

}
