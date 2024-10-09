import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionEditComponent } from './calificacion-edit.component';

describe('CalificacionEditComponent', () => {
  let component: CalificacionEditComponent;
  let fixture: ComponentFixture<CalificacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
