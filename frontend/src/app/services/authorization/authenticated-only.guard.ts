import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Authentication, AuthenticationService} from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedOnlyGuard implements CanActivate {

  private _router: Router;
  private _authentication: Authentication;

  constructor(router: Router, authenticationService: AuthenticationService) {
    this._router = router;
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });
  }

  public canActivate(): UrlTree | boolean {
    if (!this._authentication.authenticated) {
      return this._router.parseUrl('');
    }

    return true;
  }

}
