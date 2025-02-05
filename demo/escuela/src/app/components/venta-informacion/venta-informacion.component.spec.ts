import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaInformacionComponent } from './venta-informacion.component';

describe('VentaInformacionComponent', () => {
  let component: VentaInformacionComponent;
  let fixture: ComponentFixture<VentaInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaInformacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
