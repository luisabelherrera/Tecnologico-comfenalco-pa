import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoEditComponent } from './curso-edit.component';

describe('CursoEditComponent', () => {
  let component: CursoEditComponent;
  let fixture: ComponentFixture<CursoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
