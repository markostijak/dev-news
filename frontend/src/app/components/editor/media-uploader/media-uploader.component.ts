import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-media-uploader',
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MediaUploaderComponent extends QuillEditorComponent implements OnInit {
  bounds: string = 'self';

  placeholder: string = '';

  modules: QuillModule = {
    toolbar: false,
  };

  readOnly: boolean = true;

  ngOnInit(): void {
    this.onContentChanged.subscribe($event => {
      const url = $event.text;
      console.log(url);
    });
  }

}

