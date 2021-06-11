import {Injectable} from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

@Injectable({
  providedIn: 'root'
})
export class TimeFormatter {

  private formatter: TimeAgo;

  constructor() {
    TimeAgo.addLocale(en);
    this.formatter = new TimeAgo('en-US');
  }

  public format(date: string): String {
    return this.formatter.format(new Date(date));
  }

  public formatShort(date: string): String {
    return this.formatter.format(new Date(date), 'twitter');
  }

  public formatSimple(date: string): String {
    return this.formatter.format(new Date(date), 'time');
  }

}
