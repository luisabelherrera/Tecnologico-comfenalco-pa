import { TestBed } from '@angular/core/testing';

import { DocenteNivelDetalleCursoService } from './docente-nivel-detalle-curso.service';

describe('DocenteNivelDetalleCursoService', () => {
  let service: DocenteNivelDetalleCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocenteNivelDetalleCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
