import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEditComponent } from './estudiante-edit.component';

describe('EstudianteEditComponent', () => {
  let component: EstudianteEditComponent;
  let fixture: ComponentFixture<EstudianteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
