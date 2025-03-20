import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrediccionComponent } from './prediccion.component';

describe('PrediccionComponent', () => {
  let component: PrediccionComponent;
  let fixture: ComponentFixture<PrediccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrediccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrediccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
