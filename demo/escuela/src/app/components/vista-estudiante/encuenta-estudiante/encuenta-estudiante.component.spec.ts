import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaEstudianteComponent } from './encuenta-estudiante.component';

describe('EncuentaEstudianteComponent', () => {
  let component: EncuestaEstudianteComponent;
  let fixture: ComponentFixture<EncuestaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncuestaEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
