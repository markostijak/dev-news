import {Injectable} from '@angular/core';
import {AuthService, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, LoginOpt, SocialUser} from 'angularx-social-login';
import {environment} from '../../../environments/environment';
import {LoginProvider} from 'angularx-social-login/src/entities/login-provider';

@Injectable({
  providedIn: 'root'
})
export class Oauth2Provider extends AuthService {

  constructor() {
    super(new AuthServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('406447323616-d7q5d681g1jnpua58ipj002tl6piu8jq.apps.googleusercontent.com', {
          redirect_uri: environment.oauth2RedirectUri,
          offline_access: true
        })
      },
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('838239883050275', {
          redirect_uri: environment.oauth2RedirectUri
        }, 'en', '', 'v5.0')
      },
      {
        id: GitHubLoginProvider.PROVIDER_ID,
        provider: new GitHubLoginProvider('d3e47fc2ddd966fa4352', {
          redirect_uri: environment.oauth2RedirectUri
        })
      }
    ]));
  }

}

export class GitHubLoginProvider implements LoginProvider {
  static readonly PROVIDER_ID = 'GITHUB';

  private _clientId: string;
  private _options: LoginOpt;

  constructor(clientId: string, opt?: LoginOpt) {
    this._clientId = clientId;
    this._options = opt;
  }

  getLoginStatus(): Promise<SocialUser> {
    return undefined;
  }

  initialize(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
    });
  }

  signIn(): Promise<SocialUser>;

  signIn(opt?: LoginOpt): Promise<SocialUser> {
    return undefined;
  }

  signOut(revoke?: boolean): Promise<any> {
    return undefined;
  }

}
