import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaInformacionPublicComponent } from './ventana-informacion-public.component';

describe('VentanaInformacionPublicComponent', () => {
  let component: VentanaInformacionPublicComponent;
  let fixture: ComponentFixture<VentanaInformacionPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaInformacionPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaInformacionPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
