import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ventana2Component } from './ventana2.component';

describe('Ventana2Component', () => {
  let component: Ventana2Component;
  let fixture: ComponentFixture<Ventana2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ventana2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ventana2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
