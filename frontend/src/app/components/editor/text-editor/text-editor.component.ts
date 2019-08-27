import {Component, ViewEncapsulation} from '@angular/core';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextEditorComponent extends QuillEditorComponent {

  bounds: string = 'self';

  placeholder: string = 'Write your text here...';

  modules: QuillModule = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'video']
    ]
  };

}
