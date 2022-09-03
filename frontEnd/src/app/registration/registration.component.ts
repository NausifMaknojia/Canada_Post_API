import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';
import { ApiRequestService } from '../shared/api-request.service';
import { City } from '../shared/places/city.model';
import { ProvinceCityService } from '../shared/places/province-city.service';
import { Province } from '../shared/places/province.model';

import { RegistFormData } from './regist-form-data.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  mobNumberPattern = '^[0-9]{10}$';
  confirm_password: any;
  provinces: Province[];
  isValid = true;
  cities: City[];
  defaultProv = '1';
  isSending = false;
  emailMessage: string;
  fetchData: RegistFormData[] = [];
  @ViewChild('checkbox', {static:true}) inputEmailCheckBox: ElementRef; // accessing the reference element

  constructor(
    private http: HttpClient,
    private apiRequestService: ApiRequestService,
    private provinceCity: ProvinceCityService
  ) {}

  ngOnInit(): void {
    this.provinces = this.provinceCity.getProvince();
    this.cities = this.provinceCity.getCity();
  }

  onChangeState(provinceId: number) {
    if (provinceId) {
      console.log(provinceId);
      this.cities = this.provinceCity.getCitiesId(provinceId);
      console.log(this.cities);
    } else {
      this.cities = null;

    }
  }

  //send data to php server through  service
  onSubmit_Reg(postData: RegistFormData, form: NgForm) {
    if(this.isValid){
    this.isSending = true;
    // console.log(postData);
    this.apiRequestService
      .createAndStorePost(postData)
      .subscribe((responseData) => {
        this.isSending = false;
        form.reset();
        console.log(responseData);
      });
    }else{

    }
  }

  onChangeValidateUser(email: string) {
    // console.log(email);
    if (email) {
      this.apiRequestService.validateUser(email).subscribe((responseData) => {
        if(responseData['status'] === 1 || responseData['status'] === '1' ){
          this.inputEmailCheckBox.nativeElement.checkd = false;

          this.isValid = false;
          this.emailMessage = responseData['message'];
        }else{
          this.emailMessage='';
          this.isValid = true;
        }
        // console.log(responseData['message']);
      });
    }
  }

  private fetchPostData() {
    this.apiRequestService.fetchRegistPost().subscribe((post) => {
      this.fetchData = post;
      console.log(post);
    });
  }
}
