import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { saveUserData } from '../../../store/user/user.actions';
import { CommonModule } from '@angular/common';
import { DbservicesService } from '../../services/db/dbservices.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addMessage } from '../../../common/popupmessage';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {

  private userstore = inject(Store<{user:UserState}>)
    public user:any;
    public profileImageUrl:any;
    public canEdit:boolean = false;
    public editingPhoto:boolean = false;
    public editingDetails:boolean = false;
    selectedFile:any;
    detailsForm:any;

  constructor(private _route:Router, private _http: DbservicesService){}
    
    ngOnInit(){
      this.userstore.select(state => state.user).subscribe(data => this.user=data);
      
      if(!this.user.permissions.includes("ViewProfile"))
      {
        addMessage({type:"warning", message:"You Have no permission"});
        setTimeout(() => {
          this._route.navigate(['/']);        
        }, 1000);
      }

      if(this.user.permissions.includes("EditProfile")) 
        this.canEdit = true;

      this.detailsForm = new FormGroup({
            name:new FormControl("",[Validators.required]),
            email:new FormControl("", [Validators.required]),
            password:new FormControl("",[Validators.required])
          })
      
      this.profileImageUrl = `${this._http.baseURL}/Image/Get/${this.user.profilepicture}`;
    };

    onFileSelected(event:any){
      this.selectedFile = event.target.files[0];
      addMessage({type:"warning", message:"Now Upload The Image"});
    }
  
    onUpload() {
      if (!this.selectedFile) {
        addMessage({type:"warning", message:"Please Select an Image"});
        return;
      }
      
      const fileExtension = this.selectedFile.name.split('.').pop();
      if(fileExtension != "jpg"){
        addMessage({type:"warning", message:"Please Select an JPG file"});
        return;        
      }
  
      const formData = new FormData();
      formData.append('file', this.selectedFile, `${this.user.id}.${fileExtension}`);
      
      // Send the file to the server
      this._http.postRecord("Image/Upload", formData).subscribe(
        (response: any) => {
          var User = {
            ...this.user,
            profilepicture:`${this.user.id}.jpg`,
          }
          this.userstore.dispatch(saveUserData(User));
          localStorage.setItem('user', JSON.stringify(User));
          this.profileImageUrl = `${this._http.baseURL}/Image/Get/${this.user.profilepicture}`;
          this.editingPhoto=false;
          var updatedUser = {
            id: this.user.id,
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
            role: this.user.role,
            profilepicture: this.user.profilepicture,
            createdat:this.user.createdat
          }
          this._http.updateRecord(`User/${this.user.id}`, updatedUser).subscribe(
            (res)=>{
              addMessage({type:"success", message:"Uploaded the Image"});
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            },
            (error)=>{
              addMessage({type:"failure", message:"Upload Failed"});
            }
          );
        },
        (error: any) => {
          addMessage({type:"failure", message:"Upload Failed"});
        }
      );
    }
    
    changeToForm(){
      this.editingDetails = true;
      this.editingPhoto=false;

      this.detailsForm.setValue({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
      });

    }

    updateUser(){
      var userData:any = this.detailsForm.value;
      var updatedUser = {
        id: this.user.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: this.user.role,
        profilepicture: this.user.profilepicture,
        createdat:this.user.createdat
    }
    this._http.updateRecord(`User/${this.user.id}`, updatedUser).subscribe(
      (res)=>{
        addMessage({type:"success", message:"Updated Successfully"});
        
        var User = {
          id:this.user.id,
          name:userData.name,
          email:userData.email,
          password:userData.password,
          role:this.user.role,
          permissions:this.user.permissions,
          profilepicture:this.user.profilepicture,
          createdat:this.user.createdat
        }
        this.userstore.dispatch(saveUserData(User));
        localStorage.setItem('user', JSON.stringify(User));
        this.editingDetails = false;
      },
      (error)=>{
        addMessage({type:"failure", message:"Update Failes"});
      }
    )
    }

}
