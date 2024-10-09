import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteComponent } from './docente.component';

describe('DocenteComponent', () => {
  let component: DocenteComponent;
  let fixture: ComponentFixture<DocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
