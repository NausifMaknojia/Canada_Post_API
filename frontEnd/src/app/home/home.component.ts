import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiRequestService } from '../shared/api-request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private apiRequestService: ApiRequestService,
    private router: Router
    ) { }

  getRatesApiForm : FormGroup;
  postData: string[];
  status: number;
  data: string[][] = null;
  c: number = 1;
  // data2: string = null;
  isLoading = false;
  message: string = null;

  ngOnInit(): void {
    this.getRatesApiForm= new FormGroup({
      'r_from': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(7)]),
      'r_to': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(7)]),
      'r_lenght': new FormControl(null, [Validators.required]),
      'r_width': new FormControl(null, [Validators.required]),
      'r_height': new FormControl(null, [Validators.required]),
      'r_weight': new FormControl(null, [Validators.required]),

    });
  }

  onSubmitApi(){
    this.postData = [this.getRatesApiForm.get('r_from').value,
                    this.getRatesApiForm.get('r_to').value,
                    this.getRatesApiForm.get('r_lenght').value,
                    this.getRatesApiForm.get('r_width').value,
                    this.getRatesApiForm.get('r_height').value,
                    this.getRatesApiForm.get('r_weight').value];   //just an array
    this.isLoading = true;
      this.apiRequestService.getRatesFromCanadaPostAPI(this.postData)
        .subscribe((responseData) => {
          this.status = responseData['status'];
          if(this.status === 1){
           // console.log('i');
            this.isLoading = false;
            this.data = responseData['data1'];
          //  this.data2=  (responseData['data2']);
   //       this.router.navigate(['/dashboard']);
          }else{
            this.isLoading = true;
            this.message = responseData['message']['0'];
         //   console.log(responseData['message']);
          }
          setTimeout(()=>{      //<<<---using ()=> syntax
            this.isLoading = false;
            this.message = null;
       }, 3000);
       //   this.message = null;
        });
// console.log(this.getRatesApiForm);
  }

}
