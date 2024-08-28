import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCreateComponent } from './estudiante-create.component';

describe('EstudianteCreateComponent', () => {
  let component: EstudianteCreateComponent;
  let fixture: ComponentFixture<EstudianteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
