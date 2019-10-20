import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {SignUpService} from '../../../services/sign-up/sign-up.service';
import {MatStepper} from '@angular/material';
import {Authentication} from '../../../services/authentication/authentication.service';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {User} from '../../../models/user';

@Component({
  selector: 'app-sign-up-stepper',
  templateUrl: './sign-up-stepper.component.html',
  styleUrls: ['./sign-up-stepper.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpStepperComponent implements OnInit {

  @Output()
  success: EventEmitter<Authentication>;

  private signUpForm: FormGroup;

  private _user: User;
  private _formBuilder: FormBuilder;
  private _signUpService: SignUpService;

  @ViewChild('stepper', {static: false})
  private _stepper: MatStepper;

  constructor(signUpService: SignUpService, formBuilder: FormBuilder) {
    this._formBuilder = formBuilder;
    this._signUpService = signUpService;
    this.success = new EventEmitter<Authentication>();
  }

  ngOnInit(): void {
    this.signUpForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email], this.emailValidator()],
      usernameAndPassword: this._formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(5)], this.usernameValidator()],
        password: ['', [Validators.required, Validators.minLength(8)]],
      }),
      userInfo: this._formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      activation: ['', Validators.required],
      login: this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      }),
    });
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this._signUpService.checkEmailAvailability(control.value)
        .pipe(map(exists => {
          return exists ? {alreadyTaken: true} : null;
        }));
    };
  }

  private usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this._signUpService.checkUsernameAvailability(control.value)
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
      const form = {
        email: this.signUpForm.get('email').value,
        username: this.signUpForm.get('usernameAndPassword').get('username').value,
        password: this.signUpForm.get('usernameAndPassword').get('password').value,
        firstName: this.signUpForm.get('userInfo').get('firstName').value,
        lastName: this.signUpForm.get('userInfo').get('lastName').value
      };

      this._signUpService.signUp(form).subscribe(user => {
        this._user = user;
        this._stepper.next();
      });
    }
  }

  public activate(): void {
    const activation = this.signUpForm.get('activation');
    activation.markAsTouched();
    activation.updateValueAndValidity();

    if (this._user && activation.valid) {
      this._signUpService.activate(this._user, activation.value)
        .pipe(catchError(error => of(null)))
        .subscribe(user => {
          if (user) {
            this._user = user;
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
    this._signUpService.login(email, password).pipe(catchError(error => {
      return of({authenticated: false});
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
