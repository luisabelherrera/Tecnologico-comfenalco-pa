import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEstudianteDialogComponent } from './agregar-estudiante-dialog.component';

describe('AgregarEstudianteDialogComponent', () => {
  let component: AgregarEstudianteDialogComponent;
  let fixture: ComponentFixture<AgregarEstudianteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarEstudianteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEstudianteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
