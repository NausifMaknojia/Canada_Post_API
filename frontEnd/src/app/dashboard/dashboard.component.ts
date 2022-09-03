
import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiRequestService } from '../shared/api-request.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

//  const id: number;
UpdateForm: FormGroup;
  status: number = null;
  data: string[] = null;
  message: string = null;
  isData = false;
  isLoading= false;
  p_id: number = null;
  constructor(private apiRequestService: ApiRequestService) { }

// user = this.apiRequestService.user.
  ngOnInit(): void {
   const id = this.apiRequestService.user.getValue().id;
   this.p_id = id;
   this.getFetchData(id);

}

private getFetchData(id: number) {
   this.apiRequestService.fetchData(id)
  .subscribe((responseData) => {
    this.status = responseData['status'];
    if(this.status === 1){
       this.data = responseData['data'];
       this.UpdateForm= new FormGroup({
        'id'      : new FormControl(this.data['id']),
        'f_name'  : new FormControl((this.data['f_name']), [Validators.required]),
        'l_name'  : new FormControl(this.data['l_name'], [Validators.required]),
        'mob'     : new FormControl(this.data['mob'], [Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
        'province': new FormControl(this.data['province'], [Validators.required]),
        'city'    : new FormControl(this.data['city'], [Validators.required]),
      });
      // console.log(this.data);
      this.isData = true;
    }else{
      this.message = responseData['message'];
      this.isData = false;
      console.log('out fetch='+ this.message);
    }
  });
}


// =============== delete  ============

onDelete(){
console.log(this.p_id);
}

}



