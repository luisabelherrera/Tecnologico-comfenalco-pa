import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStudioComponent } from './material-studio.component';

describe('MaterialStudioComponent', () => {
  let component: MaterialStudioComponent;
  let fixture: ComponentFixture<MaterialStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialStudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
