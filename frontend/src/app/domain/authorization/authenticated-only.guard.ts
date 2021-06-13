import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {AuthenticationAware} from '../authentication/authentication-aware';
import {Observable} from 'rxjs';
import {Authentication} from '../authentication/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedOnlyGuard extends AuthenticationAware implements CanActivate {

  private _router: Router;

  constructor(router: Router, authentication$: Observable<Authentication>) {
    super(authentication$);
    this._router = router;
  }

  public canActivate(): UrlTree | boolean {
    if (!this.authenticated) {
      return this._router.parseUrl('');
    }

    return true;
  }

}
