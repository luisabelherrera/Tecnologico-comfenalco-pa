import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioEstudianteComponent } from './horario-estudiante.component';

describe('HorarioEstudianteComponent', () => {
  let component: HorarioEstudianteComponent;
  let fixture: ComponentFixture<HorarioEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
