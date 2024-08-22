import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionAulaDetailComponent } from './asignacion-aula-detail.component';

describe('AsignacionAulaDetailComponent', () => {
  let component: AsignacionAulaDetailComponent;
  let fixture: ComponentFixture<AsignacionAulaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignacionAulaDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAulaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
