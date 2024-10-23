import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurricularListComponent } from './curricular-list.component';

describe('CurricularListComponent', () => {
  let component: CurricularListComponent;
  let fixture: ComponentFixture<CurricularListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurricularListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurricularListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
