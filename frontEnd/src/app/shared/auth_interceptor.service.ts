import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { ApiRequestService } from "./api-request.service";
import { take ,exhaustMap, Observable } from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private apiRequestService: ApiRequestService ){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.apiRequestService.user.pipe(
      take(1),
      exhaustMap(user=>{
        if(!user){
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization','Bearer '+ user.token)
                   .set('Accept','application/json')});
          // params: new  HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      })
    );
   // throw new Error("Method not implemented.");
  }




}
