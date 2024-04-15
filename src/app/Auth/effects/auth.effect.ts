import { SharedService } from './../../Services/shared.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, tap } from "rxjs";

import { AuthService } from "../services/auth.service";
import { login, loginFailure, loginSuccess } from "../actions";
import { AuthDTO } from "../models/auth.dto";
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ){}

  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(login),
      mergeMap(({email, password}) => {

        let responseOK = false;
        const loginUser: AuthDTO = {email: email, password: password, user_id: null, access_token: null};

        return this.authService.login(loginUser).pipe(
          map((accessInfo) => {
            responseOK = true;
            return loginSuccess({user_id: accessInfo.user_id, access_token: accessInfo.access_token});
          }),

          catchError((err) => {
            responseOK = false;
            return of(loginFailure({payload: err}))
          }),

          tap(async () => {
            await this.sharedService.managementToast('loginFeedback', responseOK)

            if(responseOK){
              this.router.navigateByUrl('home');
            }
          })
        )

      })
    )
  )

}

        