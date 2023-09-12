import { TestBed } from '@angular/core/testing';

import { IndexesDataService } from './indexes-data.service';

describe('IndexesDataService', () => {
  let service: IndexesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
