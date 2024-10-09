import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEstudiantesComponent } from './listar.component';

describe('ListarComponent', () => {
  let component: ListarEstudiantesComponent;
  let fixture: ComponentFixture<ListarEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
