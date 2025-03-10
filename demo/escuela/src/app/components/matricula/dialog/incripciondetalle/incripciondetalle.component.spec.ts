import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripciondetalleComponent } from './incripciondetalle.component';

describe('IncripciondetalleComponent', () => {
  let component: InscripciondetalleComponent;
  let fixture: ComponentFixture<InscripciondetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripciondetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripciondetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
