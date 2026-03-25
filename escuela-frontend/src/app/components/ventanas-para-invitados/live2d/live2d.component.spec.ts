import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Live2dComponent } from './live2d.component';

describe('Live2dComponent', () => {
  let component: Live2dComponent;
  let fixture: ComponentFixture<Live2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Live2dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Live2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
