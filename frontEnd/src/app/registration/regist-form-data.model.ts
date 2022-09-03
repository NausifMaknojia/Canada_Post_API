export class RegistFormData{

  f_name: string;
  l_name: string;
  email?: string;
  mobile ?:number;    // ? mark indicate its optional
  Province?:string;
  City?:string;
  c_pass?: string;

  constructor(f_nm: string, l_nm: string, email: string, mob: number, province: string,  city: string, pass: string ) {
    this.f_name = f_nm;
    this.l_name = l_nm;
    this.email = email;
    this.mobile = mob;
    this.Province = province;
    this.City = city;
    this.c_pass = pass;


  }

}
