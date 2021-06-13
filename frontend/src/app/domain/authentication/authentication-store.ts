import {Inject, Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Authentication} from './authentication';
import {map} from 'rxjs/operators';
import {User} from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStore extends BehaviorSubject<Authentication> implements OnInit {

  private static KEY = 'authentication';

  private window: Window;
  private storage: Storage;

  constructor(@Inject('window') window: Window, @Inject('localStorage') storage: Storage) {
    super(new Authentication({}));
    this.storage = storage;
    this.window = window;
  }

  public ngOnInit(): void {
    this.window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === this.storage && event.key === AuthenticationStore.KEY) {
        const authentication = JSON.parse(this.storage.getItem(AuthenticationStore.KEY));
        this.next(new Authentication(authentication));
      }
    });
  }

  public get(): Authentication | null {
    return new Authentication(JSON.parse(this.storage.getItem(AuthenticationStore.KEY)) || {});
  }

  public save(authentication: Authentication): void {
    this.storage.setItem(AuthenticationStore.KEY, JSON.stringify(authentication));
    this.next(authentication);
  }

  public clear(): void {
    this.storage.removeItem(AuthenticationStore.KEY);
    this.next(new Authentication({}));
  }

  public authenticated$(): Observable<boolean> {
    return this.pipe(map(authentication => authentication.authenticated));
  }

  public user$(): Observable<User> {
    return this.pipe(map(authentication => authentication.principal));
  }

}
