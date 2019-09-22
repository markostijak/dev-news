import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FileService} from '../../../services/file/file.service';
import {CommunityService} from '../../../services/community/community.service';
import {Community} from '../../../models/community';

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
  private _fileService: FileService;
  private _communityService: CommunityService;

  constructor(httpClient: HttpClient, fileService: FileService, communityService: CommunityService) {
    this._httpClient = httpClient;
    this._fileService = fileService;
    this._communityService = communityService;
    this.save = new EventEmitter<any>();
    this.discard = new EventEmitter<any>();
  }

  public ngOnInit(): void {
  }

  onSave(): any {
    this._fileService.uploadImage(this.logo).subscribe(uri => {
      this._communityService.create({
        logo: uri,
        title: this.title,
        description: this.description
      } as Community).subscribe(community => {
        this.save.emit(community);
      });
    });
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
