import { TestBed } from '@angular/core/testing';

import { TimeAgoService } from './time-ago.service';

describe('TimeAgoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeAgoService = TestBed.get(TimeAgoService);
    expect(service).toBeTruthy();
  });
});
