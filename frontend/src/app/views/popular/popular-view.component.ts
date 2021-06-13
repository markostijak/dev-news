import {Component, OnInit} from '@angular/core';
import {Post} from '../../domain/post/post';
import {Page} from '../../domain/utils/hal';
import {PostService} from '../../domain/post/post.service';
import {CommunityService} from '../../domain/community/community.service';
import {State} from '../../domain/state';
import {POPULAR} from '../../domain/utils/navigation';

@Component({
  selector: 'app-popular-view',
  templateUrl: './popular-view.component.html',
  styleUrls: ['./popular-view.component.scss']
})
export class PopularViewComponent implements OnInit {

  page: Page;
  posts: Post[];
  loading: boolean = false;

  private state: State;
  private postService: PostService;
  private communityService: CommunityService;

  constructor(state: State, postService: PostService, communityService: CommunityService) {
    this.state = state;
    this.postService = postService;
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.state.navigation$.next(POPULAR);

    this.fetchPosts(0);
  }

  public fetchPosts(pageNumber: number): void {
    if (!this.loading) {
      this.loading = true;
      this.postService.fetchPopular({
        page: pageNumber,
        sort: 'createdAt,desc',
        projection: 'stats'
      }).subscribe(([posts, page]) => {
        this.posts = this.posts || [];
        this.posts.push(...posts);
        // this.page = page;
        this.loading = false;
      }, () => this.loading = false);
    }
  }

  public onScrollEnd($event: UIEvent): void {
    if (this.page && (this.page.number + 1 <= this.page.totalPages)) {
      this.fetchPosts(this.page.number + 1);
    }
  }

}
