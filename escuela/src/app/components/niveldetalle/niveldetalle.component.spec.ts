import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelDetalleComponent } from './niveldetalle.component';

describe('NiveldetalleComponent', () => {
  let component: NivelDetalleComponent;
  let fixture: ComponentFixture<NivelDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
