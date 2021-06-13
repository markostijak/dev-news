import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtProvider extends JwtHelperService {
  constructor() {
    super({});
  }

  public isValid(token: string): boolean {
    return !this.isTokenExpired(token);
  }

}
