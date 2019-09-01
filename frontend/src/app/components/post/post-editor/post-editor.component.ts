import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavigationService} from '../../../services/navigation/navigation.service';
import {Community} from '../../../models/community';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  private _title: string;
  private _content: string;

  @Output()
  private save: EventEmitter<any>;

  @Output()
  private discard: EventEmitter<any>;

  private _community: Community;

  constructor(navigationService: NavigationService) {
    this.save = new EventEmitter<any>();
    this.discard = new EventEmitter<any>();
    navigationService.navigation.subscribe(navigationItem => {
      if (navigationItem instanceof Community) {
        this._community = navigationItem;
      } else {
        this._community = null;
      }
    });
  }

  public ngOnInit(): void {
    if (this.community != null) {

    }
  }

  onContentChanged($event: any): any {
    this._content = $event.html;
  }

  onSave(): any {
    this.save.emit({
      post: {
        title: this.title,
        community: this.community,
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

  public set content(value: string) {
    this._content = value;
  }

  get community(): Community {
    return this._community;
  }

  set community(value: Community) {
    this._community = value;
  }
}
