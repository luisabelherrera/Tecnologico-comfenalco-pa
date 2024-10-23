import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurricularEditComponent } from './curricular-edit.component';

describe('CurricularEditComponent', () => {
  let component: CurricularEditComponent;
  let fixture: ComponentFixture<CurricularEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurricularEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurricularEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
