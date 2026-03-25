import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconoIaComponent } from './icono-ia.component';

describe('IconoIaComponent', () => {
  let component: IconoIaComponent;
  let fixture: ComponentFixture<IconoIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconoIaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconoIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
