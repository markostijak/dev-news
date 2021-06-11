import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, Subscription} from 'rxjs';
import {PostService} from '../../domain/post/post.service';
import {CommunityService} from '../../domain/community/community.service';
import {Post} from '../../domain/post/post';
import {Community} from '../../domain/community/community';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit, OnDestroy {

  private _activatedRoute: ActivatedRoute;

  private _postService: PostService;
  private _communityService: CommunityService;

  private _subscription: Subscription = new Subscription();

  private _posts: Post[];
  private _communities: Community[];

  constructor(postService: PostService,
              activatedRoute: ActivatedRoute,
              communityService: CommunityService) {
    this._postService = postService;
    this._activatedRoute = activatedRoute;
    this._communityService = communityService;
  }

  ngOnInit(): void {
    this._subscription.add(this._activatedRoute.params.subscribe(params => {
      this.reload(params['term']);
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private reload(term: string): void {
    this._posts = null;
    this._communities = null;

    forkJoin([
      this._communityService.search(term),
      this._postService.search(term)
    ]).subscribe((value: [Community[], Post[]]) => {
      const communities = value[0];
      const posts = value[1];
    });
  }
}
