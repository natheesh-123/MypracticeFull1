import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/user/user.state';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { saveUserData } from '../../../store/user/user.actions';
import { CommonModule } from '@angular/common';
import { DbservicesService } from '../../services/db/dbservices.service';
import { addMessage } from '../../../common/popupmessage';


@Component({
  selector: 'app-user-dashboard',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  private userstore = inject(Store<{user:UserState}>)
  public user:any;
  public profileImageUrl:any;
  @ViewChild('sidebar') sidebar!: ElementRef;  
  @ViewChild('mainContent') mainContent!: ElementRef;  
  public isSidebarOpen: boolean=false;

  constructor(private _route:Router, private _http: DbservicesService){}
  
  ngOnInit(){
    this.userstore.select(state => state.user).subscribe(data => this.user=data);
    if(!this.user.id){
      var localuser:any = localStorage.getItem('user');
      if(!!localuser){
        this.userstore.dispatch(saveUserData(JSON.parse(localuser)));
      }
      else{
        addMessage({type:"warning", message:"Login to Access Again"});
        setTimeout(() => {
          this._route.navigate(['/']);
        }, 1000);
      }
    }
    console.log(this.user);
    this.profileImageUrl =`${this._http.baseURL}/Image/Get/${this.user.profilepicture}`;
  };

  LogoutSequence(){
    localStorage.removeItem('user');
    addMessage({type:"success", message:"Logged Out"});
    setTimeout(() => {
      window.location.reload();      
    }, 1000);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;

    //  Ensure elements exist before accessing them
    if (this.sidebar && this.sidebar.nativeElement && this.mainContent && this.mainContent.nativeElement) {
      this.sidebar.nativeElement.style.left = this.isSidebarOpen ? '0px' : '-250px';
      this.mainContent.nativeElement.style.marginLeft = this.isSidebarOpen ? '250px' : '0px';
    }
}

}
