import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurricularEstudianteComponent } from './curricular-estudiante.component';

describe('CurricularEstudianteComponent', () => {
  let component: CurricularEstudianteComponent;
  let fixture: ComponentFixture<CurricularEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurricularEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurricularEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
