import { TestBed } from '@angular/core/testing';

import { RecursoService } from './recurso.service';

describe('RecursoService', () => {
  let service: RecursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
