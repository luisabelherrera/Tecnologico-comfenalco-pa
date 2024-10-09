import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurricularCreateComponent } from './curricular-create.component';

describe('CurricularCreateComponent', () => {
  let component: CurricularCreateComponent;
  let fixture: ComponentFixture<CurricularCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurricularCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurricularCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
