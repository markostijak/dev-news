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
  private _user: User;
  private _httpClient: HttpClient;
  private _oauthService: OAuthService;

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
        provider: new GitHubLoginProvider('1a0134416aad2086e0bf')
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
    return this._oauthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(facebook =>
      this.socialLogin(facebook, FacebookLoginProvider.PROVIDER_ID));
  }

  public google(): Promise<User> {
    return this._oauthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(google =>
      this.socialLogin(google, GoogleLoginProvider.PROVIDER_ID));
  }

  public github(): Promise<User> {
    return this._oauthService.signIn(GitHubLoginProvider.PROVIDER_ID).then(github =>
      this.socialLogin(github, GitHubLoginProvider.PROVIDER_ID));
  }

  public logout(): Promise<any> {
    return this._httpClient.get('/logout').toPromise();
  }

  private socialLogin(socialUser: SocialUser, provider: string): Promise<User> {
    return this._httpClient.post('http://localhost:8081/social-login', {
      provider: provider,
      email: socialUser.email,
      code: socialUser.authToken,
    }).toPromise().then(result => new User());
  }

  public get user(): User {
    return this._user;
  }

}
