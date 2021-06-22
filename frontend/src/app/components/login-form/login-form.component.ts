import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {catchError, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Authentication} from '../../domain/authentication/authentication';
import {AuthenticationService} from '../../domain/authentication/authentication.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Oauth2Provider} from '../../domain/authentication/oauth2-provider';
import {FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import {GitHubLoginProvider} from '../../domain/authentication/github-login-provider';

interface Login {
  principal: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Output()
  success = new EventEmitter<Authentication>();

  loginForm: FormGroup;

  private _sanitizer: DomSanitizer;
  private _formBuilder: FormBuilder;
  private _iconRegistry: MatIconRegistry;
  private _oAuth2Provider: Oauth2Provider;
  private _authenticationService: AuthenticationService;

  constructor(sanitizer: DomSanitizer,
              formBuilder: FormBuilder,
              iconRegistry: MatIconRegistry,
              oauth2Provider: Oauth2Provider,
              authenticationService: AuthenticationService) {

    this._sanitizer = sanitizer;
    this._formBuilder = formBuilder;
    this._iconRegistry = iconRegistry;
    this._oAuth2Provider = oauth2Provider;
    this._authenticationService = authenticationService;
  }

  ngOnInit(): void {
    Array.of('google', 'facebook', 'github').forEach(icon => {
      this._iconRegistry.addSvgIcon(
        icon,
        this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + icon + '.svg')
      );
    });

    this.loginForm = this._formBuilder.group({
      principal: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
      const login = this.loginForm.value as Login;
      this._authenticationService.login(login.principal, login.password)
        .pipe(catchError(() => of(new Authentication({}))))
        .subscribe(authentication => {
          if (authentication.authenticated) {
            this.success.emit(authentication);
          } else {
            this.loginForm.get('principal').setErrors({invalidCredentials: true});
            this.loginForm.get('password').setErrors({invalidCredentials: true});
          }
        });
    }
  }

  public facebook(): void {
    fromPromise(this._oAuth2Provider.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(switchMap(facebook => this._authenticationService.oauthLogin(facebook)))
      .subscribe(this.postLogin.bind(this));
  }

  public google(): void {
    fromPromise(this._oAuth2Provider.signIn(GoogleLoginProvider.PROVIDER_ID))
      .pipe(switchMap(google => this._authenticationService.oauthLogin(google)))
      .subscribe(this.postLogin.bind(this));
  }

  public github(): void {
    fromPromise(this._oAuth2Provider.signIn(GitHubLoginProvider.PROVIDER_ID))
      .pipe(switchMap(github => this._authenticationService.oauthLogin(github)))
      .subscribe(this.postLogin.bind(this));
  }

  private postLogin(authentication: Authentication): void {
    if (authentication.authenticated) {
      this.success.emit(authentication);
    }
  }

}
