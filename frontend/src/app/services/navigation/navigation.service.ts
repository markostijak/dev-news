import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Authentication, AuthenticationService} from '../authentication/authentication.service';
import {Community} from '../../models/community';

export interface NavigationItem {
  icon?: string;
  logo?: string;
  route?: string;
  title: string;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

export const ALL: NavigationItem = {
  icon: 'equalizer',
  title: 'All',
  route: 'c/all'
};

export const POPULAR: NavigationItem = {
  icon: 'trending_up',
  title: 'Popular',
  route: 'c/popular'
};

export const TOP_COMMUNITIES: NavigationItem = {
  icon: 'format_list_numbered',
  title: 'Top Communities',
  route: 'top-communities'
};

export const HOME: NavigationItem = {
  icon: 'home',
  title: 'Home',
  route: 'c/home'
};

export const LOGIN: NavigationItem = {
  icon: 'person',
  title: 'Login',
  route: 'login'
};

export const SIGN_UP: NavigationItem = {
  icon: 'person_add',
  title: 'Sign up',
  route: 'sign-up'
};

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _authentication: Authentication;
  private readonly _behaviourSubject: BehaviorSubject<NavigationItem>;

  constructor(authenticationService: AuthenticationService) {
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });

    this._behaviourSubject = new BehaviorSubject<NavigationItem>(this._authentication.authenticated ? HOME : POPULAR);
  }

  public get navigation(): Observable<NavigationItem> {
    return this._behaviourSubject;
  }

  public navigate(navigationItem: NavigationItem | Community): void {
    this._behaviourSubject.next(navigationItem);
  }

}
