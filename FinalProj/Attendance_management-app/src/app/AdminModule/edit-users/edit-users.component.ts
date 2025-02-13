import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { inject } from '@angular/core';
	import { Store } from '@ngrx/store';
	import { UserState } from '../../../store/user/user.state';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-edit-users',
  imports: [CommonModule,FormsModule,RouterModule, ReactiveFormsModule],
  templateUrl: './edit-users.component.html',
  styleUrl: './edit-users.component.css'
})
export class EditUsersComponent implements OnInit {
  private userstore = inject(Store<{user:UserState}>);
  	public user:any;

    users:any;
    roles:any;
    addUserForm:any;
    showUserForm = false;
    showAddUserForm = false;
    isEditing = false;
    selectedUser: any = {};

    canEditUsers:boolean= false;
  
    constructor(private _route:Router,public http: DbservicesService) {}
  
    ngOnInit() {
      this.userstore.select(state => state.user).subscribe(data => this.user=data);

      if(!this.user.permissions.includes("ViewUsers"))
        this._route.navigate(['/']);
      else
      this.loadUsers();
      
      if(this.user.permissions.includes("EditUsers"))
        this.canEditUsers = true;

      this.addUserForm  = new FormGroup({
        id: new FormControl("",[Validators.required, Validators.pattern("^[0-9]{3,4}$")]),
        name: new FormControl("",[Validators.required, Validators.pattern("^[a-zA-Z ]{3,20}$")]),
        email: new FormControl("",[Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
        password: new FormControl("",[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),
        role:new FormControl("",[Validators.required]),
      })

      this.http.getRecord("role/onlyroles").subscribe(
        (res)=>{
          this.roles = res;
        },
        (error)=>{
          
        }
      )
    }
  
    loadUsers() {
      console.log('loadUsers');
      this.http.getRecord("User").subscribe((data) => {
        this.users = data
       console.log(data);
      });

      
  }
  
    openUserForm(user: any = {}) {
      this.selectedUser = { ...user };
      this.isEditing = !!user.id;
      this.showUserForm = true;
    }
  
    closeUserForm() {
      this.showUserForm = false;
      this.selectedUser = {};

    }

    openAddUserForm() {
      this.isEditing = false;
      this.showUserForm = false;
      this.showAddUserForm=true
    }
    
    closeAddUserForm() {
      this.showAddUserForm=false
      this.addUserForm.setValue({
        id:"",
        name:"",
        email:"",
        password:"",
        role:""
      })
    }
  
    saveUser() {
        
        
      console.log("Updading user", this.selectedUser);
        if (this.isEditing) {
          this.http.updateRecord(`User/${this.selectedUser.id}`, this.selectedUser)
            .subscribe(() => {
              console.log("Updated User1");
              this.loadUsers();
            });
        } 
      
        this.closeUserForm();
      }

      addUser(){
        var newUser = {...this.addUserForm.value, profilePicture:"ProfilePhotoPlaceholder.jpg"};
        console.log(newUser);
        this.http.postRecord("user", newUser).subscribe(
          (res)=>{
            alert("New user Added");
            this.closeAddUserForm();
            this.loadUsers();
          },
          (error)=>{
            console.log("Failed to add user, Check the Users Table for Duplicate ID");
          }
        )
      }


      deleteUser(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
          this.http.deleteRecord(`User/${id}`).subscribe(() => this.loadUsers());
        }
      }
      

      validate(formcontrolname:any){
        if(formcontrolname == "id"){
          if(this.addUserForm.get("id").invalid){
            if(this.addUserForm.get("id").errors.pattern){
              addMessage({type:"warning", message:"Id is a 3 or 4 Digit Number"});
            }
            if(this.addUserForm.get("id").errors.required){
              addMessage({type:"warning", message:"id Field is Requied"});
            }
          }
        }
        else if(formcontrolname == "password"){
          if(this.addUserForm.get("password").invalid){
            if(this.addUserForm.get("password").errors.pattern){
              addMessage({
                type:"warning", 
                message:"Password should have Lower, Upper, Digits, Special Characters "});
            }
            if(this.addUserForm.get("password").errors.required){
              addMessage({type:"warning", message:"Password Field is Requied"});
            }
          }
        }
        else if(formcontrolname == "email"){
          if(this.addUserForm.get("email").invalid){
            if(this.addUserForm.get("email").errors.pattern){
              addMessage({type:"warning", message:"InValid Email"});
            }
            if(this.addUserForm.get("email").errors.required){
              addMessage({type:"warning", message:"Email is Requied"});
            }
          }
        }
        else if(formcontrolname == "name"){
          if(this.addUserForm.get("name").invalid){
            if(this.addUserForm.get("name").errors.pattern){
              addMessage({type:"warning", message:"Name should be 3 - 20 characters"});
            }
            if(this.addUserForm.get("name").errors.required){
              addMessage({type:"warning", message:"Name Field is Requied"});
            }
          }
        }
        else if(formcontrolname == "role"){
          if(this.addUserForm.get("role").invalid){
            if(this.addUserForm.get("role").errors.required){
              addMessage({type:"warning", message:"Role Field is Requied"});
            }
          }
        }
        
      }
  }
  
   
  
  


