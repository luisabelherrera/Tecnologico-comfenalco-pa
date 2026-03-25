import { TestBed } from '@angular/core/testing';

import { PreciosEducativosService } from './precios-educativos.service';

describe('PreciosEducativosService', () => {
  let service: PreciosEducativosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreciosEducativosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
