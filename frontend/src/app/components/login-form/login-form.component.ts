import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Authentication, AuthenticationService} from '../../services/authentication/authentication.service';
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

  constructor(authenticationService: AuthenticationService, router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this._router = router;
    this._sanitizer = sanitizer;
    this._iconRegistry = iconRegistry;
    this._authenticationService = authenticationService;
  }

  public login(): void {
    this._authenticationService.login(this._email.value, this._password.value).subscribe(this.postLogin.bind(this));
  }

  public facebook(): void {
    this._authenticationService.facebook().subscribe(this.postLogin.bind(this));
  }

  public google(): void {
    this._authenticationService.google().subscribe(this.postLogin.bind(this));
  }

  public github(): void {
    this._authenticationService.github().subscribe(this.postLogin.bind(this));
  }

  ngOnInit(): void {
    this._email = new FormControl('', [Validators.required, Validators.email]);
    this._password = new FormControl('', [Validators.required]);
    Array.of('google', 'facebook', 'github').forEach(icon => {
      this._iconRegistry.addSvgIcon(
        icon,
        this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + icon + '.svg')
      );
    });
  }

  private postLogin(authentication: Authentication): void {
    if (authentication.authenticated) {
      this._router.navigate(['']);
    }
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
