import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEditComponent } from './inscripcion-edit.component';

describe('InscripcionEditComponent', () => {
  let component: InscripcionEditComponent;
  let fixture: ComponentFixture<InscripcionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
