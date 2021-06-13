import {Component, OnInit} from '@angular/core';
import {State} from '../../domain/state';
import {Page} from '../../domain/utils/hal';
import {Post} from '../../domain/post/post';
import {PostService} from '../../domain/post/post.service';
import {CommunityService} from '../../domain/community/community.service';
import {HOME} from '../../domain/utils/navigation';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

  page: Page;
  posts: Post[] = [];
  loading: boolean = false;

  private state: State;
  private postService: PostService;
  private communityService: CommunityService;

  constructor(state: State, communityService: CommunityService, postService: PostService) {
    this.state = state;
    this.postService = postService;
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.state.navigation$.next(HOME);

    this.fetchPosts(0);
  }

  public fetchPosts(pageNumber: number): void {
    if (!this.loading) {
      this.loading = true;
      this.postService.fetchPageResource(this.state.user._links.posts, {
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

  public onScrollEnd($event: UIEvent): void {
    if (this.page && (this.page.number + 1 < this.page.totalPages)) {
      this.fetchPosts(this.page.number + 1);
    }
  }

}
