import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelDetalleCursoComponent } from './niveldetallecurso.component';

describe('NiveldetallecursoComponent', () => {
  let component: NivelDetalleCursoComponent;
  let fixture: ComponentFixture<NivelDetalleCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelDetalleCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelDetalleCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
