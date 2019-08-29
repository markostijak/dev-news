import {User} from '../../models/user';

export interface Credentials {
  accessToken?: string;
  refreshToken?: string;
}

export class Authentication {

  private readonly _principal: User;
  private readonly _credentials: Credentials;
  private readonly _authenticated: boolean;

  constructor(principal: User, credentials: Credentials, authenticated: boolean) {
    this._principal = principal;
    this._credentials = credentials;
    this._authenticated = authenticated;
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  get credentials(): Credentials {
    return this._credentials;
  }

  get principal(): User {
    return this._principal;
  }

}
