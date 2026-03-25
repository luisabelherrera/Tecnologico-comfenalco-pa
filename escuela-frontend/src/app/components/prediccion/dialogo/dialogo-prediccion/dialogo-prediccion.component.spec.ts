import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoPrediccionComponent } from './dialogo-prediccion.component';

describe('DialogoPrediccionComponent', () => {
  let component: DialogoPrediccionComponent;
  let fixture: ComponentFixture<DialogoPrediccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoPrediccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoPrediccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
