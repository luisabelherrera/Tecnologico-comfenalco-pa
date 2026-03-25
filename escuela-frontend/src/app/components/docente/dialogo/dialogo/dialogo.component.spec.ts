import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogoComponent } from './dialogo.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DialogoComponent', () => {
  let component: DialogoComponent;
  let fixture: ComponentFixture<DialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // Mock de MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} }, // Mock de MAT_DIALOG_DATA
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
