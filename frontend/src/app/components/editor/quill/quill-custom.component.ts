import Quill from 'quill';

const QuillVideo = Quill.import('formats/video');
const BlockEmbed = Quill.import('blots/block/embed');

const VIDEO_ATTRIBUTES = ['height', 'width'];

class Video extends BlockEmbed {
  static blotName: string;
  static className: string;
  static tagName: string;

  private domNode: any;

  static create(value): any {
    const iframeNode = QuillVideo.create(value);
    const node = super.create();
    node.appendChild(iframeNode);
    return node;
  }

  static formats(domNode): any {
    const iframe = domNode.getElementsByTagName('iframe')[0];
    return VIDEO_ATTRIBUTES.reduce(function (formats, attribute): any {
      if (iframe.hasAttribute(attribute)) {
        formats[attribute] = iframe.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static value(domNode): any {
    return domNode.getElementsByTagName('iframe')[0].getAttribute('src');
  }

  format(name, value): any {
    if (VIDEO_ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

Video.blotName = 'video';
Video.className = 'ql-video-wrapper';
Video.tagName = 'DIV';

Quill.register(Video, true);
