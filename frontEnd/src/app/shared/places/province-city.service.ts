import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { City } from "./city.model";
import { Province} from "./province.model";



@Injectable()
export class ProvinceCityService{

 private province: Province[]=[
  new Province(1, 'Alberta'),
  new Province(2, 'British Columbia'),
  new Province(3, 'Manitoba'),
  new Province(4, 'New Brunswick'),
  new Province(5, 'Newfoundland and Labrador'),
  new Province(6, 'Northwest Territories'),
  new Province(7, 'Nova Scotia'),
  new Province(8, 'Nunavut'),
  new Province(9, 'Ontario'),
  new Province(10,'Prince Edward Island'),
  new Province(11,'Quebec'),
  new Province(12,'Saskatchewan'),
  new Province(13,'Yukon')
  ];

 private city: City[]=[
   new City(1,1,'Airdrie'),
   new City(2,1,'Brooks'),
   new City(3,1,'Calgary'),
   new City(4,1,'Camrose'),
   new City(5,1,'Chestermere'),
   new City(6,1,'Cold Lake'),
   new City(7,1,'Edmonton'),
   new City(8,1,'Fort Saskatchewan'),
   new City(9,1,'Grande Prairie'),
   new City(10,1,'Lacombe'),
   new City(11,1,'Leduc'),
   new City(12,1,'Lethbridge'),
   new City(13,1,'Lloydminster'),
   new City(14,1,'Medicine Hat'),
   new City(15,1,'Red Deer'),
   new City(16,1,'Spruce Grove'),
   new City(17,1,'St. Albert'),
   new City(18,1,'Wetaskiwin'),
   new City(19,2,'Abbotsford'),
   new City(20,2,'Armstrong'),
   new City(21,2,'Burnaby'),
   new City(22,2,'Campbell River'),
   new City(23,2,'Castlegar'),
   new City(24,2,'Chilliwack'),
   new City(25,2,'Colwood'),
   new City(26,2,'Coquitlam'),
   new City(27,2,'Courtenay'),
   new City(28,2,'Cranbrook'),
   new City(29,2,'Dawson Creek'),
   new City(30,2,'Delta'),
   new City(31,2,'Duncan'),
   new City(32,2,'Vancouver'),
   new City(33,2,'Vernon'),
   new City(34,2,'Victoria'),
   new City(35,2,'West Kelowna'),
   new City(36,2,'White Rock'),
   new City(37,2,'Williams Lake'),
   new City(38,3,'Brandon'),
   new City(39,3,'Dauphin'),
   new City(40,3,'Flin Flon'),
   new City(41,3,'Morden'),
   new City(42,3,'Portage la Prairie'),
   new City(43,3,'Selkirk'),
   new City(44,3,'Steinbach'),
   new City(45,3,'Thompson'),
   new City(46,3,'Winkler'),
   new City(47,3,'Winnipeg'),
   new City(48,12,'Estevan'),
   new City(49,12,'Flin Flon'),
   new City(50,12,'Humboldt'),
   new City(51,12,'Lloydminster'),
   new City(52,12,'Martensville'),
   new City(53,12,'Meadow Lake'),
   new City(54,12,'Melfort'),
   new City(55,12,'Melville'),
   new City(56,12,'Moose Jaw'),
   new City(57,12,'North Battleford'),
   new City(58,12,'Prince Albert'),
   new City(59,12,'Regina'),
   new City(60,12,'Saskatoon'),
   new City(61,12,'Swift Current'),
   new City(62,12,'Warman'),
   new City(63,12,'Weyburn'),
   new City(64,12,'Yorkton'),

 ];
constructor(private http: HttpClient){

}

getProvince(){
  return this.province.slice();
}

getCity(){
  return this.city.slice();
}

getCitiesId(provinceId:number){
  console.log('in='+provinceId);
    return this.city.filter(x => x.p_id === +provinceId); //+ is add for a number
}

}
