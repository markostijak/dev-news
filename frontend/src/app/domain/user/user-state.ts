import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from './user';
import {Community} from '../community/community';

@Injectable({
  providedIn: 'root'
})
export class UserState {

  user$ = new BehaviorSubject<User>(null);
  communities$ = new BehaviorSubject<Community[]>(null);

  user: User;
  communities: Community[];

  constructor() {
    this.user$.subscribe(user => this.user = user);
    this.communities$.subscribe(communities => this.communities = communities);
  }

  public clear(): void {
    this.user$.next(null);
    this.communities$.next(null);
  }

}
