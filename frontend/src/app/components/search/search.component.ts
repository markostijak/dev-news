import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Post} from '../../domain/post/post';
import {Community} from '../../domain/community/community';
import {SubscriptionSupport} from '../../domain/utils/subscription-support';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {PostService} from '../../domain/post/post.service';
import {CommunityService} from '../../domain/community/community.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SubscriptionSupport implements OnInit {

  value = 'Clear me';

  searchInput: FormControl = new FormControl();

  posts: Post[] = [];
  communities: Community[] = [];
  autocomplete: FormControl;

  private postService: PostService;
  private communityService: CommunityService;

  constructor(postService: PostService, communityService: CommunityService) {
    super();
    this.postService = postService;
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(takeUntil(this.destroyed$), debounceTime(200))
      .subscribe(value => {
        if (value) {
          this.communityService.search(value).subscribe(communities => this.communities = communities);
          this.postService.search(value).subscribe(posts => this.posts = posts);
        } else {
          this.communities = [];
          this.posts = [];
        }
      });
  }

}
