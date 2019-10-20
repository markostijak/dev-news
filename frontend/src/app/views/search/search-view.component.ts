import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommunityService} from '../../services/community/community.service';
import {NavigationService} from '../../services/navigation/navigation.service';
import {forkJoin, Subscription} from 'rxjs';
import {PostService} from '../../services/post/post.service';
import {Community} from '../../models/community';
import {Post} from '../../models/post';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit, OnDestroy {

  private _activatedRoute: ActivatedRoute;
  private _navigationService: NavigationService;

  private _postService: PostService;
  private _communityService: CommunityService;

  private _subscription: Subscription = new Subscription();

  private _posts: Post[];
  private _communities: Community[];

  constructor(postService: PostService,
              activatedRoute: ActivatedRoute,
              communityService: CommunityService,
              navigationService: NavigationService) {
    this._postService = postService;
    this._activatedRoute = activatedRoute;
    this._communityService = communityService;
    this._navigationService = navigationService;
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
