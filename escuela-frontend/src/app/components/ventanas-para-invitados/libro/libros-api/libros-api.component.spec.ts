import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosApiComponent } from './libros-api.component';

describe('LibrosApiComponent', () => {
  let component: LibrosApiComponent;
  let fixture: ComponentFixture<LibrosApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrosApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
