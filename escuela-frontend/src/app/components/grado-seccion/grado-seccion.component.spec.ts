import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradoSeccionComponent } from './grado-seccion.component';

describe('GradoSeccionComponent', () => {
  let component: GradoSeccionComponent;
  let fixture: ComponentFixture<GradoSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradoSeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradoSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
