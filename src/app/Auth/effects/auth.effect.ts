import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";

import { AuthService } from "../services/auth.service";
import { login, loginFailure, loginSuccess } from "../actions";
import { AuthDTO } from "../models/auth.dto";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ){}

  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(login),
      mergeMap(({email, password}) => {

        const loginUser: AuthDTO = {email: email, password: password, user_id: null, access_token: null};

        return this.authService.login(loginUser).pipe(
          map((accessInfo) => loginSuccess({user_id: accessInfo.user_id, access_token: accessInfo.access_token})),

          catchError((err) => of(loginFailure({payload: err})))
        )

      })
    )
  )

}

        