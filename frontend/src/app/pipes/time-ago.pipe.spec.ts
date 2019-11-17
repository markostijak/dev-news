import {TimeAgoPipe} from './time-ago.pipe';
import {TimeAgoService} from '../services/time-ago/time-ago.service';

describe('TimeAgoPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeAgoPipe(new TimeAgoService());
    expect(pipe).toBeTruthy();
  });
});
