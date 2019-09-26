/* tslint:disable */
import {NgModule} from '@angular/core';
import {QuillModule} from 'ngx-quill';
import Quill from 'quill';

const QuillVideo = Quill.import('formats/video');
const BlockEmbed = Quill.import('blots/block/embed');

const VIDEO_ATTRIBUTES = ['height', 'width'];

// provides a custom div wrapper around the default Video blot
class Video extends BlockEmbed {
  static create(value) {
    const iframeNode = QuillVideo.create(value);
    const node = super.create();
    node.appendChild(iframeNode);
    return node;
  }

  static formats(domNode) {
    const iframe = domNode.getElementsByTagName('iframe')[0];
    return VIDEO_ATTRIBUTES.reduce(function (formats, attribute) {
      if (iframe.hasAttribute(attribute)) {
        formats[attribute] = iframe.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static value(domNode) {
    return domNode.getElementsByTagName('iframe')[0].getAttribute('src');
  }

  format(name, value) {
    if (VIDEO_ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        // @ts-ignore
        this.domNode.setAttribute(name, value);
      } else {
        // @ts-ignore
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

// @ts-ignore
Video.blotName = 'video';
// @ts-ignore
Video.className = 'ql-video-wrapper';
// @ts-ignore
Video.tagName = 'div';

Quill.register({
  'formats/video': Video
});

@NgModule({
  imports: [QuillModule.forRoot()],
  exports: [QuillModule]
})
export class AppEditorModule {
}
