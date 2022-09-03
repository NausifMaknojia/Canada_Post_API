import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take, tap } from "rxjs";
import { ApiRequestService } from "../api-request.service";


@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private apiRequestService: ApiRequestService, private router : Router){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

 return this.apiRequestService.user.pipe(
  take(1),
  map(user =>{
    const isAuth = !!user;
    if(isAuth){
      return !!user;
    }
  return this.router.createUrlTree(['/login']);
   }));
}

}
