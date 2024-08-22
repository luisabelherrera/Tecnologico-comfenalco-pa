import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionAulaCreateComponent } from './asignacion-aula-create.component';

describe('AsignacionAulaCreateComponent', () => {
  let component: AsignacionAulaCreateComponent;
  let fixture: ComponentFixture<AsignacionAulaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionAulaCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAulaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
