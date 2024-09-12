import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pantalla2Component } from './pantalla2.component';

describe('Pantalla2Component', () => {
  let component: Pantalla2Component;
  let fixture: ComponentFixture<Pantalla2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Pantalla2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pantalla2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
