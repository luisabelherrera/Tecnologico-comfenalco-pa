import { TestBed } from '@angular/core/testing';

import { TemaHeaderService } from './tema-header.service';

describe('TemaHeaderService', () => {
  let service: TemaHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemaHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
