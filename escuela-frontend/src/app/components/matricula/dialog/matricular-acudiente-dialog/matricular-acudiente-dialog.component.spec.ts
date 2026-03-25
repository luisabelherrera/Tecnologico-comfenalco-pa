import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatricularAcudienteDialogComponent } from './matricular-acudiente-dialog.component';

describe('MatricularAcudienteDialogComponent', () => {
  let component: MatricularAcudienteDialogComponent;
  let fixture: ComponentFixture<MatricularAcudienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatricularAcudienteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatricularAcudienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
