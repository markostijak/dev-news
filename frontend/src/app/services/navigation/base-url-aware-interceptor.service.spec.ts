import { TestBed } from '@angular/core/testing';

import { BaseUrlAwareInterceptorService } from './base-url-aware-interceptor.service';

describe('BaseUrlAwareInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseUrlAwareInterceptorService = TestBed.get(BaseUrlAwareInterceptorService);
    expect(service).toBeTruthy();
  });
});
