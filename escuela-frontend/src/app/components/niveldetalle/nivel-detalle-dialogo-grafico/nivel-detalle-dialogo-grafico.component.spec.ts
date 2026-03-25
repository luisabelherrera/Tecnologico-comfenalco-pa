import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelDetalleDialogoGraficoComponent } from './nivel-detalle-dialogo-grafico.component';

describe('NivelDetalleDialogoGraficoComponent', () => {
  let component: NivelDetalleDialogoGraficoComponent;
  let fixture: ComponentFixture<NivelDetalleDialogoGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelDetalleDialogoGraficoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelDetalleDialogoGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
