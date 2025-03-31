import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteAnalizaComponent } from './docente-analiza.component';

describe('DocenteAnalizaComponent', () => {
  let component: DocenteAnalizaComponent;
  let fixture: ComponentFixture<DocenteAnalizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenteAnalizaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenteAnalizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
