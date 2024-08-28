import { TestBed } from '@angular/core/testing';

import { DepartamentoService } from './departamento.service';

describe('DepartamentoService', () => {
  let service: DepartamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
