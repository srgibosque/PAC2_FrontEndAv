import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthDTO } from 'src/app/Auth/models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AuthService } from 'src/app/Auth/services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Store } from '@ngrx/store';
import { login } from '../../actions';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  // login(): void {
  //   let responseOK: boolean = false;
  //   let errorResponse: any;

  //   this.loginUser.email = this.email.value;
  //   this.loginUser.password = this.password.value;

  //   this.authService.login(this.loginUser)
  //   .pipe(
  //     finalize( async () => {
  //       await this.sharedService.managementToast(
  //         'loginFeedback',
  //         responseOK,
  //         errorResponse
  //       );
  //       if (responseOK) {
  //         const headerInfo: HeaderMenus = {
  //           showAuthSection: true,
  //           showNoAuthSection: false,
  //         };
          
  //         this.headerMenusService.headerManagement.next(headerInfo);
  //         this.router.navigateByUrl('home');
  //       }
  //     })
  //   )
  //   .subscribe(
  //     (authToken) => {
  //       responseOK = true;
  //       this.loginUser.user_id = authToken.user_id;
  //       this.loginUser.access_token = authToken.access_token;

  //       // save token to localstorage for next requests
  //       this.localStorageService.set('user_id', this.loginUser.user_id);
  //       this.localStorageService.set('access_token', this.loginUser.access_token);
  //     },
  //     (error: any) => {
  //       responseOK = false;
  //       errorResponse = error.error;
  //       const headerInfo: HeaderMenus = {
  //         showAuthSection: false,
  //         showNoAuthSection: true,
  //       };
  //       this.headerMenusService.headerManagement.next(headerInfo);

  //       this.sharedService.errorLog(error.error);
  //     }
  //   )
  // }

  login(): void {
    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.store.dispatch(login({email: this.loginUser.email, password: this.loginUser.password}));

    this.router.navigateByUrl('home');
  }
  
}
