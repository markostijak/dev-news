import {Component, ViewEncapsulation} from '@angular/core';
import {QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-media-uploader',
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.scss']
})
export class MediaUploaderComponent {

  modules: QuillModule = {
    toolbar: false,
  };

  public onContentChanged($event): void {

  }

}

