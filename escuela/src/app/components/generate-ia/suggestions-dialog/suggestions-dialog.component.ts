import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-suggestions-dialog',
  templateUrl: './suggestions-dialog.component.html',
  styleUrls: ['./suggestions-dialog.component.scss']
})
export class SuggestionsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { suggestions: string },
    private dialogRef: MatDialogRef<SuggestionsDialogComponent>
  ) {}

  close(): void {
    this.stop(); 
    this.dialogRef.close();  
  }
  stop(): void {
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
  speak(text: string): void {
  
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Lo siento, tu navegador no soporta la síntesis de voz.');
    }
  }

}
