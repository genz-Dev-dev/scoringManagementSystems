import { TestBed } from '@angular/core/testing';

import { SignupAdminPageService } from './signup-admin-page.service';

describe('SignupAdminPageService', () => {
  let service: SignupAdminPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupAdminPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
