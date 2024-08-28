import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionCreateComponent } from './inscripcion-create.component';

describe('InscripcionCreateComponent', () => {
  let component: InscripcionCreateComponent;
  let fixture: ComponentFixture<InscripcionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
