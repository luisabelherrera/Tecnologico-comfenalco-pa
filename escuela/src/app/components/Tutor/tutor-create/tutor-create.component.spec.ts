import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCreateComponent } from './tutor-create.component';

describe('TutorCreateComponent', () => {
  let component: TutorCreateComponent;
  let fixture: ComponentFixture<TutorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
