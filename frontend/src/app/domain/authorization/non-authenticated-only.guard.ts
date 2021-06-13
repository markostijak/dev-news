import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationAware} from '../authentication/authentication-aware';
import {Observable} from 'rxjs';
import {Authentication} from '../authentication/authentication';

@Injectable({
  providedIn: 'root'
})
export class NonAuthenticatedOnlyGuard extends AuthenticationAware implements CanActivate {

  private router: Router;

  constructor(router: Router, authentication$: Observable<Authentication>) {
    super(authentication$);
    this.router = router;
  }

  public canActivate(): any {
    if (this.authenticated) {
      return this.router.parseUrl('');
    }

    return true;
  }

}
