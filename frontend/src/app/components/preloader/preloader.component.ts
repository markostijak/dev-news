import {Component, Inject, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {

  @Input() public element = 'preloader';

  // tslint:disable-next-line:no-input-rename
  @Input('hide-after') public hideAfter = 10000;

  private document: Document;

  constructor(@Inject('document') document: Document) {
    this.document = document;
  }

  ngOnInit(): void {
    const preloader = this.document.getElementById(this.element);
    setTimeout(() => preloader.parentNode.removeChild(preloader), this.hideAfter);
  }

}
