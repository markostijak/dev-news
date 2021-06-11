import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatStepper} from '@angular/material';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Authentication} from '../../../domain/authentication/authentication';
import {User} from '../../../domain/user/user';
import {UserService} from '../../../domain/user/user.service';
import {AuthenticationService} from '../../../domain/authentication/authentication.service';

@Component({
  selector: 'app-sign-up-stepper',
  templateUrl: './sign-up-stepper.component.html',
  styleUrls: ['./sign-up-stepper.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpStepperComponent implements OnInit {

  @ViewChild('stepper', {static: false})
  private _stepper: MatStepper;

  @Output()
  public success: EventEmitter<Authentication> = new EventEmitter<Authentication>();

  user: User;
  signUpForm: FormGroup;

  formBuilder: FormBuilder;

  private userService: UserService;
  private authenticationService: AuthenticationService;

  constructor(formBuilder: FormBuilder, userService: UserService, authenticationService: AuthenticationService) {
    this.formBuilder = formBuilder;
    this.userService = userService;
    this.authenticationService = authenticationService;
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], this.emailValidator()],
      usernameAndPassword: this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(5)], this.usernameValidator()],
        password: ['', [Validators.required, Validators.minLength(8)]],
      }),
      userInfo: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      activation: ['', Validators.required],
      login: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      }),
    });
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userService.existsByEmail(control.value)
        .pipe(map(exists => {
          return exists ? {alreadyTaken: true} : null;
        }));
    };
  }

  private usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userService.existsByUsername(control.value)
        .pipe(map(exists => {
          return exists ? {alreadyTaken: true} : null;
        }));
    };
  }

  public signUp(): void {
    const userInfo = this.signUpForm.get('userInfo') as FormGroup;
    for (const control in userInfo.controls) {
      if (userInfo.controls.hasOwnProperty(control)) {
        userInfo.get(control).markAsTouched();
        userInfo.get(control).updateValueAndValidity();
      }
    }

    userInfo.markAsTouched();
    userInfo.updateValueAndValidity();

    if (userInfo.valid) {
      const userCreate = {
        email: this.signUpForm.get('email').value,
        username: this.signUpForm.get('usernameAndPassword').get('username').value,
        password: this.signUpForm.get('usernameAndPassword').get('password').value,
        firstName: this.signUpForm.get('userInfo').get('firstName').value,
        lastName: this.signUpForm.get('userInfo').get('lastName').value
      } as unknown as User;

      this.userService.create(userCreate).subscribe(user => {
        this.user = user;
        this._stepper.next();
      });
    }
  }

  public activate(): void {
    const activation = this.signUpForm.get('activation');
    activation.markAsTouched();
    activation.updateValueAndValidity();

    if (this.user && activation.valid) {
      this.userService.activate(this.user, activation.value)
        .pipe(catchError(error => of(null)))
        .subscribe(user => {
          if (user) {
            this.user = user;
            this.tryFinish(
              this.signUpForm.get('login'),
              this.signUpForm.get('email').value,
              this.signUpForm.get('usernameAndPassword').get('password').value
            );
          } else {
            activation.setErrors({
              invalidCode: true
            });
          }
        });
    }
  }

  public login(): void {
    const login = this.signUpForm.get('login') as FormGroup;
    for (const control in login.controls) {
      if (login.controls.hasOwnProperty(control)) {
        login.get(control).markAsTouched();
        login.get(control).updateValueAndValidity();
      }
    }

    login.markAsTouched();
    login.updateValueAndValidity();

    if (login.valid) {
      const email = login.get('email').value;
      const password = login.get('password').value;
      this.tryFinish(login, email, password);
    }
  }

  public tryFinish(login: AbstractControl, email: string, password: string): void {
    this.authenticationService.login(email, password).pipe(catchError(error => {
      return of(new Authentication({}));
    })).subscribe(authentication => {
      if (authentication.authenticated) {
        this.success.emit(authentication);
      } else {
        login.setErrors({invalidCredentials: true});
        login.get('email').setErrors({invalidCredentials: true});
        login.get('password').setErrors({invalidCredentials: true});
      }
    });
  }

}
