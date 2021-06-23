import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommunityService} from '../../domain/community/community.service';
import {SubscriptionSupport} from '../../domain/utils/subscription-support';
import {State} from '../../domain/state';
import {Page} from '../../domain/utils/hal';
import {Post} from '../../domain/post/post';
import {Community} from '../../domain/community/community';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent extends SubscriptionSupport implements OnInit {

  page: Page;
  posts: Post[];
  community: Community;

  private loading: boolean = false;

  private state: State;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private communityService: CommunityService;

  constructor(state: State, router: Router, activatedRoute: ActivatedRoute, communityService: CommunityService) {
    super();
    this.state = state;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.posts = null;
        this.page = null;
        this.community = null;
        this.load(params['community']);
      });
  }

  private load(alias: string): void {
    this.communityService.fetchByAlias(alias).subscribe(community => {
      this.community = community;
      this.state.navigation$.next(community);
      this.fetchPosts(0);
    }, () => this.router.navigate(['page-not-found']));
  }

  public onScrollEnd($event: UIEvent): void {
    if (this.page.number + 1 < this.page.totalPages) {
      this.fetchPosts(this.page.number + 1);
    }
  }

  private fetchPosts(pageNumber: number): void {
    if (!this.loading) {
      this.loading = true;
      this.communityService.fetchPosts(this.community, {
        page: pageNumber,
        sort: 'createdAt,desc',
        projection: 'stats'
      }).subscribe(([posts, page]) => {
        this.posts = this.posts || [];
        this.posts.push(...posts);
        this.page = page;
        this.loading = false;
      }, () => this.loading = false);
    }
  }

}
