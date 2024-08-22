import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAulaListComponent } from './asignacion-aula-list.component';

describe('AsignacionAulaListComponent', () => {
  let component: AsignacionAulaListComponent;
  let fixture: ComponentFixture<AsignacionAulaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionAulaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAulaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
