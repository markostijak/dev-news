import { TestBed, async, inject } from '@angular/core/testing';

import { AuthenticatedOnlyGuard } from './authenticated-only.guard';

describe('AuthenticatedOnlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatedOnlyGuard]
    });
  });

  it('should ...', inject([AuthenticatedOnlyGuard], (guard: AuthenticatedOnlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
