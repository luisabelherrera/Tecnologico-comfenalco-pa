import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AulaCreateComponent } from './aula-create.component';

describe('AulaCreateComponent', () => {
  let component: AulaCreateComponent;
  let fixture: ComponentFixture<AulaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AulaCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AulaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
