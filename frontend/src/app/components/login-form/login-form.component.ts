import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Authentication, AuthenticationService} from '../../services/authentication/authentication.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Output()
  success: EventEmitter<Authentication>;

  private _sanitizer: DomSanitizer;
  private _formBuilder: FormBuilder;
  private _iconRegistry: MatIconRegistry;
  private _authenticationService: AuthenticationService;

  private loginForm: FormGroup;

  constructor(sanitizer: DomSanitizer,
              formBuilder: FormBuilder,
              iconRegistry: MatIconRegistry,
              authenticationService: AuthenticationService) {

    this._sanitizer = sanitizer;
    this._formBuilder = formBuilder;
    this._iconRegistry = iconRegistry;
    this._authenticationService = authenticationService;
    this.success = new EventEmitter<Authentication>();
  }

  public login(): void {
    if (this.loginForm.valid) {
      const login = this.loginForm.value as Login;
      this._authenticationService.login(login.email, login.password).pipe(catchError(error => {
        return of({authenticated: false});
      })).subscribe(authentication => {
        if (authentication.authenticated) {
          this.success.emit(authentication);
        } else {
          this.loginForm.get('email').setErrors({invalidCredentials: true});
          this.loginForm.get('password').setErrors({invalidCredentials: true});
        }
      });
    }
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
    Array.of('google', 'facebook', 'github').forEach(icon => {
      this._iconRegistry.addSvgIcon(
        icon,
        this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + icon + '.svg')
      );
    });

    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required, Validators.minLength(8)],
    });
  }

  private postLogin(authentication: Authentication): void {
    if (authentication.authenticated) {
      this.success.emit(authentication);
    }
  }

}
