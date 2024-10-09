import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcudienteDetailComponent } from './acudiente-detail.component';

describe('AcudienteDetailComponent', () => {
  let component: AcudienteDetailComponent;
  let fixture: ComponentFixture<AcudienteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcudienteDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcudienteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
