import { TestBed } from '@angular/core/testing';

import { AcudienteService } from './acudiente.service';

describe('AcudienteService', () => {
  let service: AcudienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcudienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
