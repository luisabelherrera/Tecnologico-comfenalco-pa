import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LunaComponent } from './luna.component';

describe('LunaComponent', () => {
  let component: LunaComponent;
  let fixture: ComponentFixture<LunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LunaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
