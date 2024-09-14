import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateContentComponent } from './generate-ia.component';

describe('GenerateIaComponent', () => {
  let component: GenerateContentComponent;
  let fixture: ComponentFixture<GenerateContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
