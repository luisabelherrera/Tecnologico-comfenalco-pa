import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAulaEditComponent } from './asignacion-aula-edit.component';

describe('AsignacionAulaEditComponent', () => {
  let component: AsignacionAulaEditComponent;
  let fixture: ComponentFixture<AsignacionAulaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionAulaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAulaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
