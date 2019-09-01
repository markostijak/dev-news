import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpBackend, HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {
  AuthService as OAuth2Service,
  AuthServiceConfig as OAuth2ServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import {GitHubLoginProvider} from './git-hub-login-provider';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {JwtHelperService} from '@auth0/angular-jwt';

export interface Credentials {
  accessToken?: string;
  refreshToken?: string;
}

export interface Authentication {
  principal?: User;
  credentials?: Credentials;
  authenticated?: boolean;
  expiresAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static KEY = 'authentication';

  private _redirectUri: string = 'http://localhost:4200';

  private _httpClient: HttpClient;
  private _oauthService: OAuth2Service;
  private _jwtProvider: JwtHelperService;
  private readonly _authentication: Observable<Authentication>;
  private readonly _authenticationSource: BehaviorSubject<Authentication>;

  constructor(httpBackend: HttpBackend) {
    this._jwtProvider = new JwtHelperService();
    this._httpClient = new HttpClient(httpBackend);
    this._authenticationSource = new BehaviorSubject<Authentication>({});
    this._authentication = this._authenticationSource.asObservable();
    this._oauthService = new OAuth2Service(new OAuth2ServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('879461385833-dnjff3q4ja3o2m3s78btdcevfdk2hvof.apps.googleusercontent.com', {
          redirect_uri: this._redirectUri,
          offline_access: true
        })
      },
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('838239883050275', {
          redirect_uri: this._redirectUri
        }, 'en', '', 'v4.0')
      },
      {
        id: GitHubLoginProvider.PROVIDER_ID,
        provider: new GitHubLoginProvider('d3e47fc2ddd966fa4352', {
          redirect_uri: this._redirectUri
        })
      }
    ]));

    this.createLocalStorageHook();
    this.checkIfUserIsAlreadyAuthenticated().subscribe(authentication => {
      this._authenticationSource.next(authentication);
    });
  }

  private checkIfUserIsAlreadyAuthenticated(): Observable<Authentication> {
    const authentication = JSON.parse(localStorage.getItem(AuthenticationService.KEY)) as Authentication;
    if (authentication && authentication.credentials) {
      const credentials: Credentials = authentication.credentials;

      if (credentials.accessToken && !this._jwtProvider.isTokenExpired(credentials.accessToken)) {
        return of(authentication);
      }

      if (credentials.refreshToken && !this._jwtProvider.isTokenExpired(credentials.refreshToken)) {
        return this.jwtRefresh(credentials);
      }
    }

    return of({});
  }

  private createLocalStorageHook(): void {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === AuthenticationService.KEY) {
        const authentication = JSON.parse(localStorage.getItem(AuthenticationService.KEY)) as Authentication;
        this._authenticationSource.next(authentication || {});
      }
    });
  }

  public facebook(): Observable<Authentication> {
    return fromPromise(this._oauthService.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(switchMap(facebook => this.socialLogin(facebook)));
  }

  public google(): Observable<Authentication> {
    return fromPromise(this._oauthService.signIn(GoogleLoginProvider.PROVIDER_ID))
      .pipe(switchMap(google => this.socialLogin(google)));
  }

  public github(): Observable<Authentication> {
    return fromPromise(this._oauthService.signIn(GitHubLoginProvider.PROVIDER_ID))
      .pipe(switchMap(github => this.socialLogin(github)));
  }

  public login(email: string, password: string): Observable<Authentication> {
    return this.authenticate('api/v1/auth/login', email, password);
  }

  private socialLogin(socialUser: SocialUser): Observable<Authentication> {
    return this.authenticate('api/v1/auth/social-login', socialUser.provider, socialUser.authorizationCode);
  }

  public jwtRefresh(credentials: Credentials): Observable<Authentication> {
    return this.authenticate('api/v1/auth/refresh', credentials.accessToken, credentials.refreshToken);
  }

  public authenticate(url: string, principal: string, credentials: string): Observable<Authentication> {
    return this._httpClient.get(url, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(principal + ':' + credentials)
      }), observe: 'response'
    }).pipe(map((response: HttpResponse<User>) => {
      const accessToken = response.headers.get('X-Auth-Token');
      const refreshToken = response.headers.get('X-Refresh-Token');

      const user: User = response.body;
      const expirationDate = this._jwtProvider.getTokenExpirationDate(accessToken);
      const authenticated = !this._jwtProvider.isTokenExpired(accessToken) && !this._jwtProvider.isTokenExpired(refreshToken);

      const authentication: Authentication = {
        principal: user,
        credentials: {
          accessToken: accessToken,
          refreshToken: refreshToken
        },
        expiresAt: expirationDate,
        authenticated: authenticated
      };

      if (authenticated) {
        localStorage.setItem(AuthenticationService.KEY, JSON.stringify(authentication));
      }

      this._authenticationSource.next(authentication);

      return authentication;
    }));
  }

  public logout(): Observable<Authentication> {
    localStorage.removeItem(AuthenticationService.KEY);
    return this._authentication;
  }

  get authentication(): Observable<Authentication> {
    return this._authentication;
  }

}
