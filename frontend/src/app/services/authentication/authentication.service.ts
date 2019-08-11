import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient} from '@angular/common/http';
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
        })
      },
      {
        id: GitHubLoginProvider.PROVIDER_ID,
        provider: new GitHubLoginProvider('d3e47fc2ddd966fa4352', {
          redirect_uri: this._redirectUri
        })
      }
    ]));
  }

  public login(email: string, password: string): Promise<User> {
    return this._httpClient.post('/login', {
      email: email,
      password: password
    }).toPromise().then(result => new User());
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

  public logout(): Promise<any> {
    return this._httpClient.get('/logout').toPromise();
  }

  private socialLogin(socialUser: SocialUser): Promise<User> {
    console.log(socialUser);
    return this._httpClient.post('http://localhost:8081/social-login', {
      provider: socialUser.provider,
      code: socialUser.authorizationCode,
    }).toPromise().then(result => {
      console.log(result);
      return new User();
    });
  }

  public get user(): User {
    return this._user;
  }

}
