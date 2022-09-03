import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiRequestService } from '../shared/api-request.service';
import { catchError, Subject, throwError} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

// declaration of all variable and types


    signinForm: FormGroup;
    postData: string[];
    status: number;
    data: string;
    message: string = null;
    isLoading = false;
    error:string = null;

  constructor( private http: HttpClient,
    private apiRequestService: ApiRequestService,
    private router: Router) { }

  ngOnInit(): void {
    this.signinForm= new FormGroup({
      'u_name': new FormControl(null, [Validators.required, Validators.email]),
      'pass': new FormControl(null, [Validators.required, Validators.minLength(3)])
    });

  }

  onSubmit(){
      this.postData = [this.signinForm.get('u_name').value, this.signinForm.get('pass').value];   //just an array
      this.isLoading = true;
      if(this.postData[0] == null || this.postData[1] == null){
        this.isLoading = false;
        this.message = "UserName or Password cannot be empty";
      }else{
        this.apiRequestService.UserLogin(this.postData)
        .subscribe((responseData) => {
          this.status = responseData['status'];
          if(this.status === 1){
            this.isLoading = false;
            console.log("inside login.")
          this.router.navigate(['/dashboard']);
          }else{
            this.isLoading = false;
            this.message = responseData['message'];
            console.log(responseData);
          }
        });
      }

     // .pipe(catchError());
      // error=>{
      //   this.isLoading = false;
      //   this.error = error.message;
      //   console.log(error);
      // };
  }

}
