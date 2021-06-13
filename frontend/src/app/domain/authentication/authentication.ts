import {User} from '../user/user';

export interface Credentials {
  accessToken?: string;
  refreshToken?: string;
}

export class Authentication {

  principal: User = null;

  credentials: Credentials = {
    accessToken: null,
    refreshToken: null
  };

  authenticated: boolean = false;

  constructor(deserialized: any) {
    this.principal = deserialized.principal;
    this.credentials = deserialized.credentials;
    this.authenticated = !!deserialized.authenticated;
  }

  public hasAccessToken(): boolean {
    return this.credentials != null && this.credentials.accessToken != null;
  }

  public hasRefreshToken(): boolean {
    return this.credentials != null && this.credentials.refreshToken != null;
  }

}
