import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPreciosComponent } from './consultar-precios.component';

describe('ConsultarPreciosComponent', () => {
  let component: ConsultarPreciosComponent;
  let fixture: ComponentFixture<ConsultarPreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarPreciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
