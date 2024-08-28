import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoCreateComponent } from './departamento-create.component';

describe('DepartamentoCreateComponent', () => {
  let component: DepartamentoCreateComponent;
  let fixture: ComponentFixture<DepartamentoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartamentoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
