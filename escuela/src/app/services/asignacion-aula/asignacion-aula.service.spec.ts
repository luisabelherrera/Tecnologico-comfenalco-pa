import { TestBed } from '@angular/core/testing';

import { AsignacionAulaService } from './asignacion-aula.service';

describe('AsignacionAulaService', () => {
  let service: AsignacionAulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionAulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
