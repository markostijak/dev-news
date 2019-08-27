import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Community} from '../../../models/community';

@Component({
  selector: 'app-community-editor',
  templateUrl: './community-editor.component.html',
  styleUrls: ['./community-editor.component.scss']
})
export class CommunityEditorComponent implements OnInit {

  private _logo: string;
  private _title: string;
  private _logoPreview: string;
  private _description: string;

  @Output()
  private save: EventEmitter<any>;

  @Output()
  private discard: EventEmitter<any>;

  constructor() {
    this.save = new EventEmitter<any>();
    this.discard = new EventEmitter<any>();
  }

  public ngOnInit(): void {
  }

  onContentChanged($event: any): any {
    this._description = $event.html;
  }

  onSave(): any {
    this.save.emit(new Community(null, this.title, this.description, this.logo, 0));
  }

  onDiscard(): any {
    this.discard.emit();
  }

  onImageSelect($event: any): void {
    const logo = $event.target.files[0];
    if (logo) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this._logoPreview = event.target.result;
        this._logo = logo;
      };

      reader.readAsDataURL(logo);
    }
  }

  get logo(): string {
    return this._logo;
  }

  set logo(value: string) {
    this._logo = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get logoPreview(): string {
    return this._logoPreview;
  }

  set logoPreview(value: string) {
    this._logoPreview = value;
  }

}
