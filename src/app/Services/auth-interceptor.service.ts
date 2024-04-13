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
import { AuthState } from '../Auth/reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private store: Store<AppState>, private localStorageService: LocalStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('authApp').pipe(
      first(),
      mergeMap((response: AuthState) => {
        const token = response.credentials.access_token
        if(token){
          req = req.clone({
            setHeaders: {
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(req)
      }),
    );
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const access_token = this.localStorageService.get('access_token');
  //   if (access_token) {
  //     req = req.clone({
  //       setHeaders: {
  //         'Content-Type': 'application/json; charset=utf-8',
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //   }

  //   return next.handle(req);
  // }
}

 