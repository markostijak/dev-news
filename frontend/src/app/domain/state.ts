import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from './user/user';
import {Community} from './community/community';
import {NavigationItem} from './utils/navigation';

@Injectable({
  providedIn: 'root'
})
export class State {

  user$ = new BehaviorSubject<User>(null);
  communities$ = new BehaviorSubject<Community[]>(null);
  navigation$ = new BehaviorSubject<NavigationItem | Community>(null);
  authenticated$ = new BehaviorSubject<boolean>(null);

  user: User;
  communities: Community[];
  navigationItem: NavigationItem | Community;
  authenticated: boolean;

  constructor() {
    this.user$.subscribe(user => this.user = user);
    this.communities$.subscribe(communities => this.communities = communities);
    this.navigation$.subscribe(navigationItem => this.navigationItem = navigationItem);
    this.authenticated$.subscribe(authenticated => this.authenticated = authenticated);
  }

}
