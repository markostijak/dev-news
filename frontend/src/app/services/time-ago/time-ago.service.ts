import {Injectable} from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

@Injectable({
  providedIn: 'root'
})
export class TimeAgoService {

  private _formatter: TimeAgo;

  constructor() {
    TimeAgo.addLocale(en);
    this._formatter = new TimeAgo('en-US');
  }

  public format(date: string): String {
    return this._formatter.format(new Date(date));
  }

}
