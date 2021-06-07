import {Component, OnInit} from '@angular/core';
import {
  ALL,
  HOME,
  LOGIN,
  NavigationGroup,
  NavigationItem,
  NavigationService,
  POPULAR,
  SIGN_UP,
  TOP_COMMUNITIES
} from '../../services/navigation/navigation.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {CommunityService} from '../../services/community/community.service';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  items: NavigationGroup[] = [];
  original: NavigationGroup[] = [];

  userService: UserService;
  communityService: CommunityService;
  navigationService: NavigationService;
  authenticationService: AuthenticationService;

  constructor(communityService: CommunityService,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {
    this.communityService = communityService;
    this.navigationService = navigationService;
    this.authenticationService = authenticationService;
  }

  public ngOnInit(): void {
    this.authenticationService.authentication.subscribe(authentication => {
      if (authentication.authenticated) {
        const home: NavigationItem = HOME;
        const popular: NavigationItem = POPULAR;
        home.route = '';
        popular.route = 'c/popular';
        this.original = [
          {
            title: 'Feeds',
            items: [
              ALL,
              home,
              POPULAR,
              TOP_COMMUNITIES
            ]
          },
          {
            title: 'My communities',
            items: []
          }
        ];
        this.communityService.myCommunities().subscribe((communities: any) => {
          this.original[1].items = communities;
        });
      } else {
        const home: NavigationItem = HOME;
        const popular: NavigationItem = POPULAR;
        home.route = 'c/home';
        popular.route = '';
        this.original = [
          {
            title: 'Feeds',
            items: [
              ALL,
              popular,
              TOP_COMMUNITIES
            ]
          },
          {
            title: 'Other',
            items: [
              LOGIN,
              SIGN_UP
            ]
          }
        ];
      }

      this.items = this.original;
    });
  }

  public onFilter($event: any): void {
    const input = $event.target.value;
    if (input) {
      const items: NavigationItem[] = [];
      for (const navigationGroup of this.original) {
        for (const navigationItem of navigationGroup.items) {
          if (navigationItem.title.toLowerCase().startsWith(input)) {
            items.push(navigationItem);
          }
        }
      }

      this.items = [{items: items}];
    } else {
      this.items = this.original;
    }
  }

}
