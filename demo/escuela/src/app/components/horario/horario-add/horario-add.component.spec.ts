import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioAddComponent } from './horario-add.component';

describe('HorarioAddComponent', () => {
  let component: HorarioAddComponent;
  let fixture: ComponentFixture<HorarioAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
