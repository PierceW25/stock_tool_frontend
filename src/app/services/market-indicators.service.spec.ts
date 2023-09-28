import { TestBed } from '@angular/core/testing';

import { MarketIndicatorsService } from './market-indicators.service';

describe('MarketIndicatorsService', () => {
  let service: MarketIndicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketIndicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
