import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioListComponent } from './horario-list.component';

describe('HorarioListComponent', () => {
  let component: HorarioListComponent;
  let fixture: ComponentFixture<HorarioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
