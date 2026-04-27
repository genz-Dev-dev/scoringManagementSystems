import { TestBed } from '@angular/core/testing';

import { ListScoreServiceService } from './list-score-service.service';

describe('ListScoreServiceService', () => {
  let service: ListScoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListScoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
