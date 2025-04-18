import { TestBed } from '@angular/core/testing';

import { InformacionInstitucionalService } from './informacion-institucional.service';

describe('InformacionInstitucionalService', () => {
  let service: InformacionInstitucionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionInstitucionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
