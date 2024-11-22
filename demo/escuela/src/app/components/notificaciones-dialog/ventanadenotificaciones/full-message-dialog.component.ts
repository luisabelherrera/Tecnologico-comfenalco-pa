import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-full-message-dialog',
  templateUrl: './full-message-dialog.component.html',
  styleUrls: ['./full-message-dialog.component.scss'],
})
export class FullMessageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<FullMessageDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
