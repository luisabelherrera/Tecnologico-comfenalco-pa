import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionListComponent } from './calificacion-list.component';

describe('CalificacionListComponent', () => {
  let component: CalificacionListComponent;
  let fixture: ComponentFixture<CalificacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
