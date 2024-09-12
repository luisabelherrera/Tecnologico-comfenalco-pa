import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorDetailComponent } from './profesor-detail.component';

describe('ProfesorDetailComponent', () => {
  let component: ProfesorDetailComponent;
  let fixture: ComponentFixture<ProfesorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfesorDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
