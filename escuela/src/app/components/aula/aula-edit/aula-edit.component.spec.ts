import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulaEditComponent } from './aula-edit.component';

describe('AulaEditComponent', () => {
  let component: AulaEditComponent;
  let fixture: ComponentFixture<AulaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AulaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AulaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
