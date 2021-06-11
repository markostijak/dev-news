import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileService} from '../../../domain/utils/file.service';
import {CommunityService} from '../../../domain/community/community.service';
import {Community} from '../../../domain/community/community';

@Component({
  selector: 'app-community-editor',
  templateUrl: './community-editor.component.html',
  styleUrls: ['./community-editor.component.scss']
})
export class CommunityEditorComponent implements OnInit {

  @Output()
  private save: EventEmitter<any> = new EventEmitter();

  @Output()
  private discard: EventEmitter<any> = new EventEmitter();

  logo: File;
  title: string;
  logoPreview: string;
  description: string;

  private httpClient: HttpClient;
  private fileService: FileService;
  private communityService: CommunityService;

  constructor(httpClient: HttpClient, fileService: FileService, communityService: CommunityService) {
    this.httpClient = httpClient;
    this.fileService = fileService;
    this.communityService = communityService;
  }

  public ngOnInit(): void {
  }

  onSave(): any {
    this.fileService.uploadImage(this.logo).subscribe(uri => {
      this.communityService.create({
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
        this.logoPreview = event.target.result;
        this.logo = logo;
      };

      reader.readAsDataURL(logo);
    }
  }

}
