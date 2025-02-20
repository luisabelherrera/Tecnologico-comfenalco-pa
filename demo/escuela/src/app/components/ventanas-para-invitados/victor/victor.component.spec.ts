import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VictorComponent } from './victor.component';

describe('VictorComponent', () => {
  let component: VictorComponent;
  let fixture: ComponentFixture<VictorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VictorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
