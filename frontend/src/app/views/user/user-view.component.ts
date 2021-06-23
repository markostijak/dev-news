import {Component, OnInit} from '@angular/core';
import {State} from '../../domain/state';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../domain/user/user';
import {UserService} from '../../domain/user/user.service';
import {SubscriptionSupport} from '../../domain/utils/subscription-support';
import {Community} from '../../domain/community/community';
import {Post} from '../../domain/post/post';
import {PostService} from '../../domain/post/post.service';
import {CommunityService} from '../../domain/community/community.service';
import {Page} from '../../domain/utils/hal';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends SubscriptionSupport implements OnInit {

  user: User;
  communities: Community[] = [];
  posts: Post[] = [];
  page: Page;

  private state: State;
  private router: Router;
  private activatedRoute: ActivatedRoute;

  private userService: UserService;
  private postService: PostService;
  private communityService: CommunityService;

  constructor(state: State, router: Router, activatedRoute: ActivatedRoute,
              userService: UserService, postService: PostService, communityService: CommunityService) {
    super();
    this.state = state;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.postService = postService;
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.user = null;
        this.load(params['user']);
      });
  }

  private load(username: string): void {
    this.userService.fetchByUsername(username, 'info')
      .subscribe(user => {
        this.user = user;
        this.navigate(user);
        this.fetchCommunities(user);
        this.fetchPosts(user, 0);
      }, () => this.router.navigate(['page-not-found']));
  }

  private fetchCommunities(user: User): void {
    this.communityService.fetchAll(user._links.communities)
      .subscribe(communities => this.communities = communities);
  }

  private fetchPosts(user: User, pageNumber: number): void {
    this.postService.fetchPageResource(user._links.createdPosts, {
      page: pageNumber,
      projection: 'stats',
      sort: 'createdAt,desc',
    }).subscribe(([posts, page]) => {
      this.posts.push(...posts);
      this.page = page;
    });
  }

  private navigate(user: User): void {
    this.state.navigation$.next({
      icon: 'person',
      title: `${user.firstName} ${user.lastName}`,
      route: `u/${user.username}`
    });
  }

  public onScrollEnd($event: UIEvent): void {
    if (this.page.number + 1 < this.page.totalPages) {
      this.fetchPosts(this.user, this.page.number + 1);
    }
  }

}
