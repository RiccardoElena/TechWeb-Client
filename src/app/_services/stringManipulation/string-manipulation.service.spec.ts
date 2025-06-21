import { TestBed } from '@angular/core/testing';

import { StringManipulationService } from './string-manipulation.service';

describe('StringManipulationService', () => {
  let service: StringManipulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringManipulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
