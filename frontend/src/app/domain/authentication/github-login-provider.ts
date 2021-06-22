import {LoginProvider} from 'angularx-social-login/src/entities/login-provider';
import {LoginOpt, SocialUser} from 'angularx-social-login';
import {loginWithGithub} from 'github-oauth-popup';

export class GitHubLoginProvider implements LoginProvider {
  static readonly PROVIDER_ID = 'GITHUB';

  constructor(
    private clientId: string,
    private initOptions: any = {scope: 'read:user user:email'}
  ) {}

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  getLoginStatus(): Promise<SocialUser> {
    return Promise.resolve(undefined);
  }

  signIn(signInOptions?: LoginOpt): Promise<SocialUser> {
    const options = {client_id: this.clientId, ...this.initOptions, ...signInOptions};

    return new Promise((resolve, reject) => {
      loginWithGithub(options, {height: 670, width: 600}).then(response => {
        const user: SocialUser = new SocialUser();
        if (response && response.code) {
          user.authorizationCode = response.code;
          resolve(user);
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  signOut(revoke?: boolean): Promise<any> {
    return Promise.resolve(undefined);
  }

}
