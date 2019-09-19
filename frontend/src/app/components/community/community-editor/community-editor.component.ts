import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-community-editor',
  templateUrl: './community-editor.component.html',
  styleUrls: ['./community-editor.component.scss']
})
export class CommunityEditorComponent implements OnInit {

  private _logo: File;
  private _title: string;
  private _logoPreview: string;
  private _description: string;

  @Output()
  private save: EventEmitter<any>;

  @Output()
  private discard: EventEmitter<any>;

  private _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this.save = new EventEmitter<any>();
    this.discard = new EventEmitter<any>();
  }

  public ngOnInit(): void {
  }

  onSave(): any {
    const form = new FormData();
    form.set('file', this.logo);

    this._httpClient.post('/api/v1/files/image', form)
      .pipe(mergeMap(uri => this._httpClient.post('/api/v1/communities', {
        logo: uri,
        title: this.title,
        description: this.description
      }))).subscribe(c => this.save.emit(c));
  }

  onDiscard(): void {
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

  get logo(): File {
    return this._logo;
  }

  set logo(value: File) {
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

}
