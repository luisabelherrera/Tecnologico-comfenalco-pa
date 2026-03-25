import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ventana3Component } from './ventana3.component';

describe('Ventana3Component', () => {
  let component: Ventana3Component;
  let fixture: ComponentFixture<Ventana3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ventana3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ventana3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
