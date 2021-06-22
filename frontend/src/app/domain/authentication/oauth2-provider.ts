import {Injectable} from '@angular/core';
import {AuthService, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import {environment} from '../../../environments/environment';
import {GitHubLoginProvider} from './github-login-provider';

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
        provider: new GitHubLoginProvider('1a0134416aad2086e0bf')
      }
    ]));
  }

}
