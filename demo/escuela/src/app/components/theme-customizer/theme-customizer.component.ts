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
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    isActive: true
  };

  predefinedThemes: Theme[] = [
    { name: 'Navidad', backgroundColor: '#FF0000', textColor: '#FFFFFF', isActive: false },
    { name: 'Halloween', backgroundColor: '#FF7518', textColor: '#FFFFFF', isActive: false },
    { name: 'San Valentín', backgroundColor: '#FF69B4', textColor: '#FFFFFF', isActive: false }
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
    this.applyTheme(this.selectedTheme);
  }

  private updateThemesList(newActiveTheme: Theme) {
    this.themes = this.themes.map(t => ({ ...t, isActive: false }));
    this.themes = this.themes.filter(t => t.id !== newActiveTheme.id);
    this.themes.push(newActiveTheme);
  }
}