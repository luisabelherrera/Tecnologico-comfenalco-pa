import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncripciondetalleComponent } from './incripciondetalle.component';

describe('IncripciondetalleComponent', () => {
  let component: IncripciondetalleComponent;
  let fixture: ComponentFixture<IncripciondetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncripciondetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncripciondetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
