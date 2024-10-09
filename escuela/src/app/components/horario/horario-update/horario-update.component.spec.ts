import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioUpdateComponent } from './horario-update.component';

describe('HorarioUpdateComponent', () => {
  let component: HorarioUpdateComponent;
  let fixture: ComponentFixture<HorarioUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
