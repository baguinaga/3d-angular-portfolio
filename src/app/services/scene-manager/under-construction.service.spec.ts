import { TestBed } from '@angular/core/testing';

import { UnderConstructionService } from './under-construction.service';

describe('UnderConstructionService', () => {
  let service: UnderConstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnderConstructionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
