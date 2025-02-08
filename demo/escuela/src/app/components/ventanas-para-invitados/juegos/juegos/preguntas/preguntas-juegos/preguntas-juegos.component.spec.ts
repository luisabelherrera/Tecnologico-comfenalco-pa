import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasJuegosComponent } from './preguntas-juegos.component';

describe('PreguntasJuegosComponent', () => {
  let component: PreguntasJuegosComponent;
  let fixture: ComponentFixture<PreguntasJuegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntasJuegosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasJuegosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
