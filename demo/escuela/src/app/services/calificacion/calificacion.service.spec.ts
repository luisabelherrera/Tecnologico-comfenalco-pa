import { TestBed } from '@angular/core/testing';

import { CalificacionService } from './calificacion.service';

describe('CalificacionService', () => {
  let service: CalificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
