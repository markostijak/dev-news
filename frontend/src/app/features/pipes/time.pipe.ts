import {Pipe, PipeTransform} from '@angular/core';
import {TimeFormatter} from '../../domain/utils/time-formatter';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  private timeAgoService: TimeFormatter;

  constructor(timeAgoService: TimeFormatter) {
    this.timeAgoService = timeAgoService;
  }

  transform(value: string, ...args: any[]): any {
    return this.timeAgoService.formatSimple(value);
  }

}
