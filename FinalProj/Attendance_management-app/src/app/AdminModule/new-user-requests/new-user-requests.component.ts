import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { Router } from '@angular/router';
import { DbservicesService } from '../../services/db/dbservices.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-new-user-requests',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-user-requests.component.html',
  styleUrl: './new-user-requests.component.css'
})
export class NewUserRequestsComponent {
  private userstore = inject(Store<{user:UserState}>)
  public user:any;
  public Roles:any;
  public userRequests:any = [];
  public viewRequestOf:number = -1;
  updateRequestForm:any;

  constructor(private _route:Router, private _http: DbservicesService){}
  
  ngOnInit(){
    this.userstore.select(state => state.user).subscribe(data => this.user=data);

    if(!this.user.permissions.includes("NewUserRequests")){
      setTimeout(() => {
        this._route.navigate(['/']);        
      }, 1000);
      addMessage({type:"warning", message:"You Have no permission"});
    }
    else
      this.getUserRequests();

    this.updateRequestForm = new FormGroup({
      id: new FormControl("",[Validators.required]),
      name: new FormControl("",[Validators.required]),
      email: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required]),
      role: new FormControl("",[Validators.required]),
      profilePicture: new FormControl("",[Validators.required])
    })

    this._http.getRecord("role/onlyroles").subscribe(
      (res)=>{
        this.Roles = res;
      },
      (error)=>{
        addMessage({type:"failure", message:"Error Getting Data From Server"});
      }
    )
  }

  getUserRequests(){
    this._http.getRecord("usersregistration").subscribe(
      (res)=>{
        this.userRequests = res;
      },
      (error)=>{
        addMessage({type:"failure", message:"Error Getting Data From Server"});
      }
    )
  }

  approveUser(){
    var userData:any = this.updateRequestForm.value;
    var newUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      profilePicture: userData.profilePicture
  }
    

    this._http.postRecord("user", newUser).subscribe(
      (res) =>{        
        this._http.deleteRecord(`usersregistration/${newUser.id}`).subscribe(
          (res)=>{
            addMessage({type:"success", message:"User Approved Successfully"});
            this.viewRequestOf = -1;
            this.getUserRequests();
          },
          (er) => {
            addMessage({type:"failure", message:"Unable to Approved User"});
          }
        )
        
      },
      (error)=>{
        addMessage({type:"failure", message:"Unable to Approved User"});
      }
    )
    
  }

  rejectUser(){
    this._http.deleteRecord(`Usersregistration/${this.viewRequestOf}`).subscribe(
      (res)=>{
        addMessage({type:"warning", message:"User Reject"});
        
        this.viewRequestOf = -1;
        this.getUserRequests();
      },
      (error)=>{
        addMessage({type:"failure", message:"Unable to Reject User"});
      }
    )
  }

  
  setvalues(requests:any){
    this.viewRequestOf = requests.id;

    this.updateRequestForm.setValue({
      id: requests.id,
      name: requests.name,
      email: requests.email,
      password: requests.password,
      role: requests.role,
      profilePicture:requests.profilePicture
    });
    return true;
  }



}
