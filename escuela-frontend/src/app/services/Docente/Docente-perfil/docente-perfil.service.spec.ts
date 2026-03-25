import { TestBed } from '@angular/core/testing';

import { DocentePerfilService } from './docente-perfil.service';

describe('DocentePerfilService', () => {
  let service: DocentePerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocentePerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
