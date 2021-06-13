import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {forkJoin, iif, Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
import {debounceTime, flatMap, map} from 'rxjs/operators';
import {FileService} from '../../../domain/utils/file.service';
import {Post} from '../../../domain/post/post';
import {Community} from '../../../domain/community/community';
import {PostService} from '../../../domain/post/post.service';
import {CommunityService} from '../../../domain/community/community.service';
import {SubscriptionSupport} from '../../../domain/utils/subscription-support';
import {State} from '../../../domain/state';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent extends SubscriptionSupport implements OnInit {

  @Output()
  save: EventEmitter<Post> = new EventEmitter<Post>();

  @Output()
  discard: EventEmitter<any> = new EventEmitter<any>();

  title: string;
  content: object;
  selected: Community;
  autocomplete: FormControl;
  communities: Community[];
  state: State;

  private postService: PostService;
  private fileService: FileService;
  private communityService: CommunityService;

  constructor(state: State,
              postService: PostService,
              fileService: FileService,
              communityService: CommunityService) {
    super();
    this.state = state;
    this.postService = postService;
    this.fileService = fileService;
    this.autocomplete = new FormControl();
    this.communityService = communityService;
  }

  public ngOnInit(): void {
    const community = this.state.navigationItem as Community;
    if (community && community.logo) {
      this.communities = [community];
      this.autocomplete.setValue(community);
      this.selected = community;
    } else {
      this.communities = this.state.communities;
    }

    this.autocomplete.valueChanges.pipe(
      debounceTime(200),
      flatMap(value => iif(() => value.length > 0, this.communityService.search(value), of(this.state.communities)))
    ).subscribe(communities => this.communities = communities);

    this.autocomplete.valueChanges.subscribe(value => {
      if (this.selected && this.selected.title !== value) {
        this.selected = null;
      }
    });
  }

  onCommunitySelected($event: MatAutocompleteSelectedEvent): void {
    this.selected = $event.option.value;
  }

  displayCommunity(community: Community): string {
    return community ? community.title : '';
  }

  onContentChanged($event: any): any {
    this.content = $event.content;
  }

  onSave(): void {
    const observables: Observable<string>[] = [];
    // @ts-ignore
    for (const op of this.content.ops) {
      if (op.insert && op.insert.image && op.insert.image.startsWith('data')) {
        observables.push(this.fileService.uploadDataUrl(op.insert.image).pipe(map(url => op.insert.image = url)));
      }
    }

    if (observables.length === 0) {
      observables.push(of(null));
    }

    forkJoin(observables).subscribe(() => {
      this.postService.create(this.selected, {
        title: this.title,
        content: JSON.stringify(this.content)
      } as Post).subscribe((post: Post) => {
        post.community = this.selected;
        this.save.emit(post);
      });
    });
  }

  onDiscard(): void {
    this.discard.emit();
  }

}
