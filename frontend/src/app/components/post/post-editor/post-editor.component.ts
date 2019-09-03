import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavigationService} from '../../../services/navigation/navigation.service';
import {Community} from '../../../models/community';
import {Authentication, AuthenticationService} from '../../../services/authentication/authentication.service';
import {HttpClient} from '@angular/common/http';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  private _title: string;
  private _selected: Community;
  private _content: string;

  @Output()
  private save: EventEmitter<any>;

  @Output()
  private discard: EventEmitter<any>;

  private _autocomplete: FormControl;
  private _httpClient: HttpClient;
  private _communities: Observable<Community[]>;
  private _navigation: Observable<Community>;
  private readonly _authentication: Observable<Authentication>;

  constructor(navigationService: NavigationService, authenticationService: AuthenticationService, httpClient: HttpClient) {
    this._httpClient = httpClient;
    this.save = new EventEmitter<any>();
    this.discard = new EventEmitter<any>();
    this._autocomplete = new FormControl();
    this._authentication = authenticationService.authentication;
    this._navigation = navigationService.navigation as Observable<Community>;
  }

  public ngOnInit(): void {
    this._navigation.subscribe((community: Community) => {
      if (community.logo) {
        this._communities = of([community]);
        this.autocomplete.setValue(community);
        this.selected = community;
      } else {
        this._communities = this._httpClient.get('/api/v1/c/all') as Observable<Community[]>;
      }
    });
  }

  onCommunitySelected($event: MatAutocompleteSelectedEvent): void {
    this._selected = $event.option.value;
  }

  displayCommunity(community: Community): string {
    return community.title;
  }

  onContentChanged($event: any): any {
    this._content = $event.html;
  }

  onSave(): any {
    this.save.emit({
      post: {
        title: this.title,
        community: this.selected,
        content: this.content
      }
    });
  }

  onDiscard(): any {
    this.discard.emit();
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get content(): string {
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
