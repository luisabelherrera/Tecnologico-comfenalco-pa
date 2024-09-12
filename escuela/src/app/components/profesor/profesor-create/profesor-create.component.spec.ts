import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorCreateComponent } from './profesor-create.component';

describe('ProfesorCreateComponent', () => {
  let component: ProfesorCreateComponent;
  let fixture: ComponentFixture<ProfesorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfesorCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
