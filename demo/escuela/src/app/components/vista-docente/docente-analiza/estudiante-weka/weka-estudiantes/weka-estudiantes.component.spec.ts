import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WekaEstudiantesComponent } from './weka-estudiantes.component';

describe('WekaEstudiantesComponent', () => {
  let component: WekaEstudiantesComponent;
  let fixture: ComponentFixture<WekaEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WekaEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WekaEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
