import { TestBed } from '@angular/core/testing';

import { RolePermissionServiceService } from './role-permission-service.service';

describe('RolePermissionServiceService', () => {
  let service: RolePermissionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolePermissionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
