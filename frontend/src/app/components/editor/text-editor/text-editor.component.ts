import {Component, Input} from '@angular/core';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent extends QuillEditorComponent {

  bounds: string = 'self';

  placeholder: string = 'Write your text here...';

  @Input()
  content: string;

  modules: QuillModule = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{'header': 1}, {'header': 2}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video']
      ],
      handlers: {}
    }
  };

}
