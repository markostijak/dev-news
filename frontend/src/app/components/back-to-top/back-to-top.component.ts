import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  public scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}
