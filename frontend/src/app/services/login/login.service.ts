import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient} from '@angular/common/http';
import {
  AuthService as OAuthService,
  AuthServiceConfig as OAuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import {GitHubLoginProvider} from './git-hub-login-provider';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _httpClient: HttpClient;
  private _oauthService: OAuthService;
  private _user: User;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._oauthService = new OAuthService(new OAuthServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('879461385833-mgach0766m2012v6a0bdpo8i9frk4cr8.apps.googleusercontent.com')
      },
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('aaa')
      },
      {
        id: GitHubLoginProvider.PROVIDER_ID,
        provider: new GitHubLoginProvider('aaa')
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
    return this._httpClient.post('/login', {
      email: socialUser.email,
      authToken: socialUser.authToken,
      authorizationCode: socialUser.authorizationCode
    }).toPromise().then(result => new User());
  }

  public get user(): User {
    return this._user;
  }

}
