import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcudienteFormComponent } from './acudiente-form.component';

describe('AcudienteFormComponent', () => {
  let component: AcudienteFormComponent;
  let fixture: ComponentFixture<AcudienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcudienteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcudienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
