import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiRequestService } from './shared/api-request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
//declaration of variables
  title = 'frontEnd';
  isAuthenicated = false;
  private userSub: Subscription;
  UserName: string;
  //UserName = this.apiRequestService.user.getValue().email;
  constructor(private apiRequestService: ApiRequestService){
  }

ngOnInit(): void {
  //create user object and check if he is logged in or not.
  this.userSub = this.apiRequestService.user.subscribe(user=>{
    this.isAuthenicated = !user ? false : true; // this is same as !!user
    this.UserName = user.email;
  //  console.log(user);
  });

// +++++++autologin ++++++
this.apiRequestService.autoLogin();

}

onLogOut(){
  this.apiRequestService.LogOut();
}

ngOnDestroy(): void {
this.userSub.unsubscribe();
}

}
