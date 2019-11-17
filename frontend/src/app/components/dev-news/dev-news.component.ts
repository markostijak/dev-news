import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dev-news',
  templateUrl: './dev-news.component.html',
  styleUrls: ['./dev-news.component.scss']
})
export class DevNewsComponent implements OnInit {

  private _year: number;

  constructor() {
  }

  ngOnInit(): void {
    this._year = new Date().getFullYear();
  }

  get year(): number {
    return this._year;
  }

}
