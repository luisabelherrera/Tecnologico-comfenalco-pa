import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurricularComponent } from './curricular.component';

describe('CurricularComponent', () => {
  let component: CurricularComponent;
  let fixture: ComponentFixture<CurricularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurricularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
