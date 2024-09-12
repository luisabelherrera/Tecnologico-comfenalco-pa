import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AulaDetailComponent } from './aula-detail.component';

describe('AulaDetailComponent', () => {
  let component: AulaDetailComponent;
  let fixture: ComponentFixture<AulaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AulaDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AulaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
