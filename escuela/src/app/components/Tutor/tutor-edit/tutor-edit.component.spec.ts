import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorEditComponent } from './tutor-edit.component';

describe('TutorEditComponent', () => {
  let component: TutorEditComponent;
  let fixture: ComponentFixture<TutorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
