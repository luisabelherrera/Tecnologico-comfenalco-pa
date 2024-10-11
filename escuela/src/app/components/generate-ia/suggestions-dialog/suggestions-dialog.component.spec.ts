import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsDialogComponent } from './suggestions-dialog.component';

describe('SuggestionsDialogComponent', () => {
  let component: SuggestionsDialogComponent;
  let fixture: ComponentFixture<SuggestionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
