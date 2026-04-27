import { TestBed } from '@angular/core/testing';

import { ScoreUploadServiceService } from './score-upload-service.service';

describe('ScoreUploadServiceService', () => {
  let service: ScoreUploadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreUploadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
