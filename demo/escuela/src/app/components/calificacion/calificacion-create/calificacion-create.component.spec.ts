import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionCreateComponent } from './calificacion-create.component';

describe('CalificacionCreateComponent', () => {
  let component: CalificacionCreateComponent;
  let fixture: ComponentFixture<CalificacionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
