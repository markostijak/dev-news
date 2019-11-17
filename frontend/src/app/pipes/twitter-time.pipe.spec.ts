import {ShortTimePipe} from './twitter-time.pipe';
import {TimeAgoService} from '../services/time-ago/time-ago.service';

describe('TwitterTimePipe', () => {
  it('create an instance', () => {
    const pipe = new ShortTimePipe(new TimeAgoService());
    expect(pipe).toBeTruthy();
  });
});
