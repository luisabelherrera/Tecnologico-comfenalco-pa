import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorListComponent } from './tutor-list.component';

describe('CoursesListComponent', () => {
  let component: TutorListComponent;
  let fixture: ComponentFixture<TutorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
