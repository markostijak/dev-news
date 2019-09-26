import {Component, OnInit} from '@angular/core';
import {NavigationService, SIGN_UP} from '../../services/navigation/navigation.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-sign-up-view',
  templateUrl: './sign-up-view.component.html',
  styleUrls: ['./sign-up-view.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpViewComponent implements OnInit {

  private _signUpFormGroup: FormGroup;
  private _activationFormGroup: FormGroup;
  private _loginFormGroup: FormGroup;

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService, private _formBuilder: FormBuilder) {
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(SIGN_UP);
    this._signUpFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this._activationFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this._loginFormGroup = this._formBuilder.group({
      loginCtrl: ['', Validators.required]
    });
  }

  get signUpFormGroup(): FormGroup {
    return this._signUpFormGroup;
  }

  get activationFormGroup(): FormGroup {
    return this._activationFormGroup;
  }

  get loginFormGroup(): FormGroup {
    return this._loginFormGroup;
  }

}
