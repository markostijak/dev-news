import {Subject} from 'rxjs';
import {OnDestroy} from '@angular/core';

export class SubscriptionSupport implements OnDestroy {

  protected destroyed$: Subject<boolean> = new Subject();

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
