import { TestBed } from '@angular/core/testing';

import { ScriptureService } from './scripture.service';

describe('ScriptureService', () => {
  let service: ScriptureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
