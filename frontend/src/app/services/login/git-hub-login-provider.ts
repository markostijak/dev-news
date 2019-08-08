import {LoginOpt, SocialUser} from 'angularx-social-login';
import {LoginProvider} from 'angularx-social-login/src/entities/login-provider';

export class GitHubLoginProvider implements LoginProvider {
  static readonly PROVIDER_ID = 'GITHUB';

  private _clientId: string;

  constructor(clientId: string) {
    this._clientId = clientId;
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
