import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
// @ts-ignore
import {FormControl, Validators} from '@angular/forms';
// @ts-ignore
import {DomSanitizer} from '@angular/platform-browser';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  private _email: FormControl;
  private _password: FormControl;

  private _router: Router;
  private _sanitizer: DomSanitizer;
  private _iconRegistry: MatIconRegistry;
  private _authenticationService: AuthenticationService;

  private _hidePassword: boolean = true;

  constructor(authenticationService: AuthenticationService, router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this._router = router;
    this._sanitizer = sanitizer;
    this._iconRegistry = iconRegistry;
    this._authenticationService = authenticationService;
    this._email = new FormControl('', [Validators.required, Validators.email]);
    this._password = new FormControl('', [Validators.required]);
  }

  public login(): void {
    this._authenticationService.login(this._email.value, this._password.value).subscribe(value => console.log(value));
  }

  public facebook(): void {
    this._authenticationService.facebook().subscribe(value => console.log(value));
  }

  public google(): void {
    this._authenticationService.google().subscribe(value => {
      this._router.navigate(['']);
    });
  }

  public github(): void {
    this._authenticationService.github().subscribe(value => console.log(value));
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


  get hidePassword(): boolean {
    return this._hidePassword;
  }

  set hidePassword(value: boolean) {
    this._hidePassword = value;
  }

}
