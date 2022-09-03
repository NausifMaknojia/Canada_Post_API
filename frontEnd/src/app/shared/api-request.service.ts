import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';

import { RegistFormData } from 'src/app/registration/regist-form-data.model';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable()
export class ApiRequestService {
  postData: string[];
  private localExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  // ************************** create user instance **************************************************
  user = new BehaviorSubject<User>(null);     // why behaviorsubject? so it can also give subscriber the immediate access to previos emitted value,

  // ************************  registation page  *******************************************************
  createAndStorePost(postData: RegistFormData) {
    console.log(postData);
    return this.http.post<RegistFormData[]>(
      'http://127.0.0.1:8000/api/users/add',
      postData
    );
  }

  validateUser(email: string) {
    // console.log(email);
    return this.http.get<string>('http://127.0.0.1:8000/api/users/validate', {
      headers: new HttpHeaders({ Accept: 'application/json' }),
      params: new HttpParams().set('email', email),
    });
  }

  fetchRegistPost() {
    return this.http.get('http://127.0.0.1:8000/api/data').pipe(
      map((responseData) => {
        const postArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      })
    );
  }

  // ********************************************* LOGIN CODE *******************************************************************

  autoLogin(){
    const userData:{
      email: string,
      id: number,
      _token: string,
      _tokenExpirationDate: string      //later we will convert to date
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
      const loadUser = new User(userData.email,userData.id, userData._token, new Date(userData._tokenExpirationDate) );
    if(loadUser.token){
      this.user.next(loadUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogOut(expirationDuration);
    }

  }

  UserLogin(postData) {
 // console.log(postData[0]);
    return this.http.post<string[]>(
      'http://127.0.0.1:8000/api/users/get_UserLogin',
      {
        'email':postData[0],
        'pass': postData[1]
      }
    ).pipe(catchError(this.handleError), tap(responseData =>{
      var dt= new Date();
      const expirationDate = new Date(dt.setHours(dt.getHours()+ 1));
      //console.log("dateTime= "+expirationDate+"  ---email= "+responseData['data']['email']);
      const user = new User(responseData['data']['email'],responseData['data']['id'],responseData['token'], expirationDate);
      this.user.next(user);     //we stored the user date and used that "next" which is used with subjext indicating that this is now current user
      this.autoLogOut(3600000);   //2 hour in millisec
      localStorage.setItem('userData', JSON.stringify(user));  //convert angular object to string
    }));
  }
  private handleError(errResp: HttpErrorResponse){
    let errorMessage = "Unknown  error occured";
    return errorMessage;
  }

  // ===================  LOGOUT  ======================================================

  LogOut(){
    this.user.next(null);
    this.router.navigate(["/login"]);
    localStorage.removeItem('userData');
    if(this.localExpirationTimer){
      clearTimeout(this.localExpirationTimer);
    }
    this.localExpirationTimer = null;     //important
  }

  autoLogOut(ExpirationTimer: number){
    this.localExpirationTimer = setTimeout(() => {
    this.LogOut();
    }, ExpirationTimer);
  }

  // ========================= END LOGOUT   ===================================================

  fetchData(id: number) {
    return this.http.post<RegistFormData[]>('http://127.0.0.1:8000/api/users/fetchData', {
     'id':id
    });
  }



   // ========================= Get rates from Canada post API  ===================================================

  getRatesFromCanadaPostAPI(postData){
    console.log(postData);
    return this.http.get<string[]>(
      'http://127.0.0.1:8000/api/CanadaPostAPI/getRates',{
        headers: new HttpHeaders({ Accept: 'application/json' }),
        params: new HttpParams()
                .set('from', postData[0])
                .set('to', postData[1])
                .set('length', postData[2])
                .set('width', postData[3])
                .set('height', postData[4])
                .set('weight', postData[5])

      });

  }


}
