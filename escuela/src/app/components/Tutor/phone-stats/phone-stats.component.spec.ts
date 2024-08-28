import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneStatsComponent } from './phone-stats.component';

describe('PhoneStatsComponent', () => {
  let component: PhoneStatsComponent;
  let fixture: ComponentFixture<PhoneStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
