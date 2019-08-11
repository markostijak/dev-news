import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
// @ts-ignore
import {FormControl, Validators} from '@angular/forms';
// @ts-ignore
import {DomSanitizer} from '@angular/platform-browser';
import {AuthenticationService} from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _email: FormControl;
  private _password: FormControl;
  private _sanitizer: DomSanitizer;
  private _loginService: AuthenticationService;
  private _iconRegistry: MatIconRegistry;

  constructor(loginService: AuthenticationService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this._sanitizer = sanitizer;
    this._loginService = loginService;
    this._iconRegistry = iconRegistry;
    this._email = new FormControl('', [Validators.required, Validators.email]);
    this._password = new FormControl('', [Validators.required]);
  }

  public login(): void {
    this._loginService.login(this._email.value, this._password.value).then(value => console.log(value));
  }

  public facebook(): void {
    this._loginService.facebook().then(value => console.log(value));
  }

  public google(): void {
    this._loginService.google().then(value => console.log(value));
  }

  public github(): void {
    this._loginService.github().then(value => console.log(value));
  }

  ngOnInit(): void {
    Array.of('google', 'facebook', 'github').forEach(icon => {
      this._iconRegistry.addSvgIcon(
        icon,
        this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + icon + '.svg')
      );
    });
  }

  get email(): FormControl {
    return this._email;
  }

  set email(value: FormControl) {
    this._email = value;
  }

  get password(): FormControl {
    return this._password;
  }

  set password(value: FormControl) {
    this._password = value;
  }

}
