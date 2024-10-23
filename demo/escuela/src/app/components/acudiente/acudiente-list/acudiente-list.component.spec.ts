import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcudienteListComponent } from './acudiente-list.component';

describe('AcudienteListComponent', () => {
  let component: AcudienteListComponent;
  let fixture: ComponentFixture<AcudienteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcudienteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcudienteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
