import {SubscriptionSupport} from '../utils/subscription-support';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Authentication} from './authentication';
import {User} from '../user/user';

export class AuthenticationAware extends SubscriptionSupport {

  protected principal: User;
  protected authenticated: boolean;
  protected authentication: Authentication;
  protected authentication$: Observable<Authentication>;

  public constructor(authentication$: Observable<Authentication>) {
    super();
    this.authentication$ = authentication$;
    authentication$.pipe(takeUntil(this.destroyed$))
      .subscribe(authentication => {
        this.authentication = authentication;
        this.authenticated = authentication.authenticated;
        this.principal = authentication.principal;
      });
  }

}
