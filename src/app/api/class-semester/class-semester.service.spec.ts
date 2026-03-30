import { TestBed } from '@angular/core/testing';

import { ClassSemesterService } from './class-semester.service';

describe('ClassSemesterService', () => {
  let service: ClassSemesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassSemesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
