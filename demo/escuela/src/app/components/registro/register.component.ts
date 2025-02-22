import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Docente } from 'src/app/models/entity/docente.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { RegisterDto, RoleDto, UserDto } from 'src/app/models/models';
import { RegistrationService } from 'src/app/services/auth/Registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  registerDto: RegisterDto = {
    id: 0,
    username: '',
    email: '',
    password: '',
    roles: [],
    docenteInfo: null as any,
    estudianteId: 0
  };
  users: UserDto[] = [];
  pagedUsers: UserDto[] = [];
  estudiantes: Estudiante[] = [];
  docentes: Docente[] = [];
  roles: RoleDto[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  isEditing: boolean = false; // Para distinguir entre registrar y actualizar

  // Propiedades del paginador
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.loading = true;
    this.registrationService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.updatePagedUsers();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios: ' + err.message;
        this.loading = false;
      }
    });
  }

  updatePagedUsers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedUsers();
  }

  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.loading = true;
      this.registrationService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado correctamente';
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar usuario: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  // Método para cargar los datos del usuario en el formulario para edición
  editUser(user: UserDto): void {
    this.isEditing = true;
    this.registerDto = {
      id: user.id || 0,
      username: user.username || '',
      email: user.email || '',
      password: '', // Dejamos vacío por seguridad, el backend debe ignorarlo si no se envía
      roles: user.roles || [],
      docenteInfo: user.docenteInfo || null,
      estudianteId: user.estudiante ? user.estudiante.idEstudiante : 0
    };
  }

  getRolesString(user: UserDto): string {
    return user.roles?.map(role => role.name).join(', ') || 'Sin roles';
  }

  loadEstudiantes(): void {
    this.registrationService.getAllEstudiantes().subscribe({
      next: (estudiantes) => (this.estudiantes = estudiantes),
      error: (err) => (this.errorMessage = 'Error al cargar estudiantes: ' + err.message)
    });
  }

  loadRoles(): void {
    this.registrationService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        const estudianteRol = roles.find(r => r.name === 'Estudiante');
        if (estudianteRol && !this.isEditing) this.registerDto.roles = [estudianteRol];
      },
      error: (err) => (this.errorMessage = 'Error al cargar roles: ' + err.message)
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.isEditing) {
      // Actualizar usuario existente
      this.registrationService.updateUser(this.registerDto.id, this.registerDto).subscribe({
        next: (updatedUser) => {
          this.successMessage = 'Usuario actualizado correctamente';
          this.resetForm();
          this.isEditing = false;
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar usuario: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      // Registrar nuevo usuario
      this.registrationService.register(this.registerDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message;
            this.resetForm();
            this.loadUsers();
          } else {
            this.errorMessage = response.message;
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error al registrar: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.registerDto = {
      id: 0,
      username: '',
      email: '',
      password: '',
      roles: this.registerDto.roles,
      docenteInfo: null as any,
      estudianteId: 0
    };
    this.isEditing = false; // Reiniciar el estado de edición
  }
}