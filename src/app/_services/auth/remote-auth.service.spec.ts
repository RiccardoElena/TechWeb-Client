import { TestBed } from '@angular/core/testing';

import { RemoteAuthService } from './remote-auth.service';

describe('RemoteAuthService', () => {
  let service: RemoteAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
