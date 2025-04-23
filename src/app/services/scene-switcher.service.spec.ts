import { TestBed } from '@angular/core/testing';

import { SceneSwitcherService } from './scene-switcher.service';

describe('SceneSwitcherService', () => {
  let service: SceneSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
