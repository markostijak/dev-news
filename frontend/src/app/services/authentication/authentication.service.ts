import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  AuthService as OAuth2Service,
  AuthServiceConfig as OAuth2ServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import {GitHubLoginProvider} from './git-hub-login-provider';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _user: User;
  private _httpClient: HttpClient;
  private _oauthService: OAuth2Service;
  private _redirectUri: string = 'http://localhost:4200';

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
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
  }

  public facebook(): Promise<User> {
    return this._oauthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(facebook => this.socialLogin(facebook));
  }

  public google(): Promise<User> {
    return this._oauthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(google => this.socialLogin(google));
  }

  public github(): Promise<User> {
    return this._oauthService.signIn(GitHubLoginProvider.PROVIDER_ID).then(github => this.socialLogin(github));
  }

  public login(email: string, password: string): Promise<User> {
    return this.authenticate('auth/login', email, password);
  }

  private socialLogin(socialUser: SocialUser): Promise<User> {
    console.log(socialUser);
    return this.authenticate('auth/social-login', socialUser.provider, socialUser.authorizationCode);
  }

  public jwtRefresh(accessToken: string, refreshToken: string): Promise<User> {
    return this.authenticate('auth/refresh', accessToken, refreshToken);
  }

  public authenticate(url: string, principal: string, credentials: string): Promise<User> {
    return this._httpClient.get(url, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(principal + ':' + credentials)
      })
    }).toPromise().then(result => {
      console.log(result);
      const user: User = new User();
      user.accessToken = '';
      user.refreshToken = '';

      return this._user = user;
    });
  }

  public logout(): Promise<any> {
    return this._httpClient.get('/logout').toPromise();
  }


  get user(): User {
    return this._user;
  }
}
