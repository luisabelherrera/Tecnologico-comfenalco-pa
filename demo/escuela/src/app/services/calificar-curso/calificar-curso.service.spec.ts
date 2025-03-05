import { TestBed } from '@angular/core/testing';

import { CalificarCursoService } from './calificar-curso.service';

describe('CalificarCursoService', () => {
  let service: CalificarCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalificarCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
