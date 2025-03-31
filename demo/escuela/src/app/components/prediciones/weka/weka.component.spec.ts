import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WekaComponent } from './weka.component';

describe('WekaComponent', () => {
  let component: WekaComponent;
  let fixture: ComponentFixture<WekaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WekaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WekaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
