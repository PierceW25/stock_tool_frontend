import { TestBed } from '@angular/core/testing';

import { PromtSigninServiceService } from './promt-signin-service.service';

describe('PromtSigninServiceService', () => {
  let service: PromtSigninServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromtSigninServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
