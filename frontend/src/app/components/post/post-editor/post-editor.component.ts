import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NavigationService} from '../../../services/navigation/navigation.service';
import {Community} from '../../../models/community';
import {Authentication, AuthenticationService} from '../../../services/authentication/authentication.service';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Post} from '../../../models/post';
import {CommunityService} from '../../../services/community/community.service';
import {PostService} from '../../../services/post/post.service';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {FileService} from '../../../services/file/file.service';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit, OnDestroy {

  @Output()
  public save: EventEmitter<Post> = new EventEmitter<Post>();

  @Output()
  public discard: EventEmitter<any> = new EventEmitter<any>();

  private _title: string;
  private _selected: Community;
  private _content: object;

  private _postService: PostService;
  private _fileService: FileService;
  private _navigation: Observable<Community>;
  private _communityService: CommunityService;
  private _communities: Observable<Community[]>;

  private readonly _autocomplete: FormControl;
  private readonly _authentication: Observable<Authentication>;
  private _subscription: Subscription;

  constructor(postService: PostService,
              fileService: FileService,
              communityService: CommunityService,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {

    this._postService = postService;
    this._fileService = fileService;
    this._autocomplete = new FormControl();
    this._communityService = communityService;
    this._authentication = authenticationService.authentication;
    this._navigation = navigationService.navigation as Observable<Community>;
  }

  public ngOnInit(): void {
    this._subscription = this._navigation.subscribe((community: Community) => {
      if (community.logo) {
        this._communities = of([community]);
        this.autocomplete.setValue(community);
        this.selected = community;
      } else {
        this._communities = this._communityService.myCommunities();
      }
    });

    this._communities = this._autocomplete.valueChanges.pipe(startWith(this.communities))
      .pipe(debounceTime(300), switchMap(value => this._communityService.search(value)));

    this._autocomplete.valueChanges.subscribe(value => {
      if (this._selected && this._selected.title !== value) {
        this._selected = null;
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onCommunitySelected($event: MatAutocompleteSelectedEvent): void {
    this._selected = $event.option.value;
  }

  displayCommunity(community: Community): string {
    return community ? community.title : '';
  }

  onContentChanged($event: any): any {
    this._content = $event.content;
  }

  onSave(): void {
    const observables: Observable<string>[] = [];
    // @ts-ignore
    for (const op of this._content.ops) {
      if (op.insert && op.insert.image && op.insert.image.startsWith('data')) {
        observables.push(this._fileService.uploadDataUrl(op.insert.image).pipe(map(url => op.insert.image = url)));
      }
    }

    if (observables.length === 0) {
      observables.push(of(null));
    }

    forkJoin(observables).subscribe(() => {
      this._postService.create({
        title: this._title,
        content: JSON.stringify(this._content),
        community: this._selected._links.self.href as any
      } as Post).subscribe((post: Post) => {
        post.community = this._selected;
        this.save.emit(post);
      });
    });
  }

  onDiscard(): void {
    this.discard.emit();
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get content(): object {
    return this._content;
  }

  set selected(value: Community) {
    this._selected = value;
  }

  get selected(): Community {
    return this._selected;
  }

  get authentication(): Observable<Authentication> {
    return this._authentication;
  }

  get communities(): Observable<Community[]> {
    return this._communities;
  }

  get autocomplete(): FormControl {
    return this._autocomplete;
  }

}
