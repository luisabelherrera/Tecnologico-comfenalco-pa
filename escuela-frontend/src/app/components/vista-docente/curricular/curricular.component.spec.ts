import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurricularDocenteComponent } from './curricular.component';

describe('CurricularComponent', () => {
  let component: CurricularDocenteComponent;
  let fixture: ComponentFixture<CurricularDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurricularDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurricularDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
