import {Pipe, PipeTransform} from '@angular/core';
import {TimeFormatter} from '../../domain/utils/time-formatter';

@Pipe({
  name: 'shortTime'
})
export class ShortTimePipe implements PipeTransform {

  private timeAgoService: TimeFormatter;

  constructor(timeAgoService: TimeFormatter) {
    this.timeAgoService = timeAgoService;
  }

  transform(value: string, ...args: any[]): any {
    return this.timeAgoService.formatShort(value);
  }

}
