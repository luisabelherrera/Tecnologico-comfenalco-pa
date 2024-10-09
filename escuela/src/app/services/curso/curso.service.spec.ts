import { TestBed } from '@angular/core/testing';

import { CursosService } from './curso.service';

describe('CursoService', () => {
  let service: CursosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
