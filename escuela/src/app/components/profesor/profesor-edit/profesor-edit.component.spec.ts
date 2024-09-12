import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorEditComponent } from './profesor-edit.component';

describe('ProfesorEditComponent', () => {
  let component: ProfesorEditComponent;
  let fixture: ComponentFixture<ProfesorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfesorEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
