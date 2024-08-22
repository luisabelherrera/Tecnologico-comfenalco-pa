import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AulaListComponent } from './aula-list.component';

describe('AulaListComponent', () => {
  let component: AulaListComponent;
  let fixture: ComponentFixture<AulaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AulaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AulaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
