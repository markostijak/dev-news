import {Component, EventEmitter, HostListener, Inject, Input, OnInit, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-infinite-scroller',
  templateUrl: './infinite-scroller.component.html',
  styleUrls: ['./infinite-scroller.component.scss']
})
export class InfiniteScrollerComponent {

  @Output()
  public end: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  @Input()
  public offset: number = 600;
  @Input()
  public throttle: number = 1000;

  private _timer: number;
  private _document: Document;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this._document = document;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: UIEvent): void {
    if (this._timer) {
      return;
    }

    // @ts-ignore
    const window = $event.target.defaultView;
    const scrollHeight = this._document.documentElement.scrollHeight;

    if ((window.innerHeight + window.scrollY) > (scrollHeight - this.offset)) {
      this.end.emit($event);
      this._timer = setTimeout(() => {
        this._timer = null;
      }, this.throttle);
    }
  }

}
