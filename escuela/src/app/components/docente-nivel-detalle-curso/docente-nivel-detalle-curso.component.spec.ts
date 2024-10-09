import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteNivelDetalleCursoComponent } from './docente-nivel-detalle-curso.component';

describe('DocenteNivelDetalleCursoComponent', () => {
  let component: DocenteNivelDetalleCursoComponent;
  let fixture: ComponentFixture<DocenteNivelDetalleCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenteNivelDetalleCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenteNivelDetalleCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
