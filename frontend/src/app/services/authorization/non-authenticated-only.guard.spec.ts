import { TestBed, async, inject } from '@angular/core/testing';

import { NonAuthenticatedOnlyGuard } from './non-authenticated-only.guard';

describe('NonAuthenticatedOnlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NonAuthenticatedOnlyGuard]
    });
  });

  it('should ...', inject([NonAuthenticatedOnlyGuard], (guard: NonAuthenticatedOnlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
