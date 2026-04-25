import { TestBed } from '@angular/core/testing';

import { AuditLogServiceService } from './audit-log-service.service';

describe('AuditLogServiceService', () => {
  let service: AuditLogServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditLogServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
