import { TestBed } from '@angular/core/testing';

import { AsistenciaService } from './docente-asistencia.service';

describe('DocenteAsistenciaService', () => {
  let service: AsistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
