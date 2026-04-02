import { TestBed } from '@angular/core/testing';

import { DepartmentClassServiceService } from './department-class-service.service';

describe('DepartmentClassServiceService', () => {
  let service: DepartmentClassServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentClassServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
