import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionDetailComponent } from './calificacion-detail.component';

describe('CalificacionDetailComponent', () => {
  let component: CalificacionDetailComponent;
  let fixture: ComponentFixture<CalificacionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
