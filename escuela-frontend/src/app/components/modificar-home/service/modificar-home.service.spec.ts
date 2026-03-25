import { TestBed } from '@angular/core/testing';

import { ModificarHomeService } from './modificar-home.service';

describe('ModificarHomeService', () => {
  let service: ModificarHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModificarHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
