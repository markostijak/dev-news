import { Pipe, PipeTransform } from '@angular/core';
import {TimeAgoService} from '../services/time-ago/time-ago.service';

@Pipe({
  name: 'shortTime'
})
export class ShortTimePipe implements PipeTransform {

  private _timeAgoService: TimeAgoService;

  constructor(timeAgoService: TimeAgoService) {
    this._timeAgoService = timeAgoService;
  }

  transform(value: string, ...args: any[]): any {
    return this._timeAgoService.formatShort(value);
  }

}
