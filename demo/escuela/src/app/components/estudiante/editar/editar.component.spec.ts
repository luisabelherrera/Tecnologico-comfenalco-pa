import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEstudianteComponent } from './editar.component';

describe('EditarComponent', () => {
  let component: EditarEstudianteComponent;
  let fixture: ComponentFixture<EditarEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
