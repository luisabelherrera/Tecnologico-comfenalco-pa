import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEstudianteComponent } from './perfil-estudiante.component';

describe('PerfilEstudianteComponent', () => {
  let component: PerfilEstudianteComponent;
  let fixture: ComponentFixture<PerfilEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
