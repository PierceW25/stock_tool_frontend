import { TestBed } from '@angular/core/testing';

import { UpdateWatchlistService } from './update-watchlist.service';

describe('UpdateWatchlistService', () => {
  let service: UpdateWatchlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateWatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
