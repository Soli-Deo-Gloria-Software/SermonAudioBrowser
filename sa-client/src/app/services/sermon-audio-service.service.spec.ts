import { TestBed } from '@angular/core/testing';

import { SermonAudioServiceService } from './sermon-audio-service.service';

describe('SermonAudioServiceService', () => {
  let service: SermonAudioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SermonAudioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
