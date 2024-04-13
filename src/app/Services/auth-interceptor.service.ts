import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, first, mergeMap } from 'rxjs';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { AuthDTO } from '../Auth/models/auth.dto';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private store: Store<AppState["authApp"]>, private localStorageService: LocalStorageService) {
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.store.select('credentials').pipe(
  //     exhaustMap((credentials: AuthDTO) => {
  //       if(credentials.access_token){
  //         req = req.clone({
  //           setHeaders: {
  //             'Content-Type': 'application/json; charset=utf-8',
  //             Accept: 'application/json',
  //             Authorization: `Bearer ${credentials.access_token}`,
  //           },
  //         });
  //       }
  //       return next.handle(req)
  //     }),
  //   );
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token = this.localStorageService.get('access_token');
    if (access_token) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
    }

    return next.handle(req);
  }
}

 