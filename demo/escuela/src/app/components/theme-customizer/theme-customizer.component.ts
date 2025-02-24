import { Component, OnInit } from '@angular/core';
import { Theme, TemaHeaderService } from 'src/app/services/tema-header/tema-header.service';

@Component({
  selector: 'app-theme-customizer',
  templateUrl: './theme-customizer.component.html',
  styleUrls: ['./theme-customizer.component.scss']
})
export class ThemeCustomizerComponent implements OnInit {
  themes: Theme[] = [];
  selectedTheme: Theme = {
    name: '',
    backgroundColor: '#ffffff',  // Default single color
    textColor: '#333333',
    isActive: true
  };
  useSplitColors: boolean = false;

  predefinedThemes: Theme[] = [
    { name: 'Navidad (Split)', backgroundColorLeft: '#ffe6e6', backgroundColorRight: '#ffcccc', textColor: '#d32f2f', isActive: false },
    { name: 'Halloween (Split)', backgroundColorLeft: '#fff3e0', backgroundColorRight: '#ffe0b2', textColor: '#f57c00', isActive: false },
    { name: 'San Valentín', backgroundColor: '#ff69b4', textColor: '#ffffff', isActive: false }
  ];

  constructor(private temaHeaderService: TemaHeaderService) {}

  ngOnInit(): void {
    this.temaHeaderService.getThemes().subscribe({
      next: (themes) => {
        this.themes = themes;
        console.log('Temas cargados:', themes);
      },
      error: (err) => console.error('Error al cargar temas:', err)
    });
  }

  toggleSplitColors() {
    this.useSplitColors = !this.useSplitColors;
    if (!this.useSplitColors) {
      delete this.selectedTheme.backgroundColorLeft;
      delete this.selectedTheme.backgroundColorRight;
      this.selectedTheme.backgroundColor = '#ffffff';
    } else {
      delete this.selectedTheme.backgroundColor;
      this.selectedTheme.backgroundColorLeft = '#f0f0f0';
      this.selectedTheme.backgroundColorRight = '#ffffff';
    }
  }

  applyTheme(theme: Theme) {
    this.temaHeaderService.applyTheme(theme);
    this.temaHeaderService.saveTheme(theme).subscribe({
      next: () => {
        console.log('Tema aplicado y guardado como activo');
        this.updateThemesList(theme);
      },
      error: (err) => console.error('Error al guardar tema:', err)
    });
  }

  saveTheme() {
    this.temaHeaderService.saveTheme(this.selectedTheme).subscribe({
      next: (savedTheme) => {
        this.themes = this.themes.filter(t => !t.isActive);
        this.themes.push(savedTheme);
        this.applyTheme(savedTheme);
      },
      error: (err) => console.error('Error al guardar tema:', err)
    });
  }

  selectPredefinedTheme(theme: Theme) {
    this.selectedTheme = { ...theme, isActive: true };
    this.useSplitColors = !!(theme.backgroundColorLeft || theme.backgroundColorRight);
    this.applyTheme(this.selectedTheme);
  }

  private updateThemesList(newActiveTheme: Theme) {
    this.themes = this.themes.map(t => ({ ...t, isActive: false }));
    this.themes = this.themes.filter(t => t.id !== newActiveTheme.id);
    this.themes.push(newActiveTheme);
  }
}