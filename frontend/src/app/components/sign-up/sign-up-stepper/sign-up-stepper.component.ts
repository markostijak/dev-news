import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {SignUpService} from '../../../services/sign-up/sign-up.service';
import {Router} from '@angular/router';
import {User} from '../../../models/user';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'app-sign-up-stepper',
  templateUrl: './sign-up-stepper.component.html',
  styleUrls: ['./sign-up-stepper.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpStepperComponent implements OnInit {

  private _user: User;

  private _router: Router;
  private _signUpFormGroup: FormGroup;
  private _signUpService: SignUpService;

  @ViewChild('stepper', {static: false})
  private _stepper: MatStepper;

  constructor(router: Router, signUpService: SignUpService) {
    this._router = router;
    this._signUpService = signUpService;
  }

  ngOnInit(): void {
    this._signUpFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, [Validators.required, Validators.min(5)]),
      password: new FormControl(null, [Validators.required, Validators.min(8)]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      activationCode: new FormControl(null, [Validators.required])
    });
  }

  public signUp(): void {
    const form = {
      email: this.signUpFormGroup.get('email').value,
      username: this.signUpFormGroup.get('username').value,
      password: this.signUpFormGroup.get('password').value,
      firstName: this.signUpFormGroup.get('firstName').value,
      lastName: this.signUpFormGroup.get('lastName').value
    };

    this._signUpService.signUp(form).subscribe(user => {
      this._user = user;
      this._stepper.next();
    });
  }

  public activate(): void {
    const activationCode = this.signUpFormGroup.get('activationCode').value;
    this._signUpService.activate(this._user, activationCode).subscribe(user => {
      this._user = user;
      this._stepper.next();
    });
  }

  public checkUsername(): void {
    const username = this.signUpFormGroup.get('username').value;
    console.log(username);
    this._stepper.next();
  }

  public login(): void {
    const email = this.signUpFormGroup.get('email').value;
    const password = this.signUpFormGroup.get('password').value;
    this._signUpService.login(email, password).subscribe(authentication => {
      if (authentication.authenticated) {
        this._router.navigate(['']);
      }
    });
  }

  get signUpFormGroup(): FormGroup {
    return this._signUpFormGroup;
  }

}
