import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/models';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';

@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.scss']
})
export class PerfilEstudianteComponent implements OnInit {

  userProfile: UserDto | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(private estudiantePerfilService: EstudiantePerfilService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.estudiantePerfilService.getStudentProfile()
      .subscribe({
        next: (profile: UserDto) => {
          this.userProfile = profile;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading profile: ' + err.message;
          this.loading = false;
        }
      });
  }

  // Helper method to get roles as string
  getRolesString(): string {
    return this.userProfile?.roles?.map(role => role.name).join(', ') || '';
  }
}