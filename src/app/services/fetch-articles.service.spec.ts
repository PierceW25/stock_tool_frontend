import { TestBed } from '@angular/core/testing';

import { FetchArticlesService } from './fetch-articles.service';

describe('FetchArticlesService', () => {
  let service: FetchArticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchArticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
