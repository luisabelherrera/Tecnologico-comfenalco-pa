import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Docente } from 'src/app/models/entity/docente.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { UserDto, RegisterDto, RoleDto } from 'src/app/models/models';
import { RegistrationService } from 'src/app/services/auth/Registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredUsers = new MatTableDataSource<UserDto>([]);
  registerDto: RegisterDto = { username: '', email: '', password: '', roles: [] };
  users: UserDto[] = [];
  pagedUsers: UserDto[] = [];
  estudiantes: Estudiante[] = [];
  docentes: Docente[] = [];
  roles: RoleDto[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;
  filterValue = '';
  showForm: boolean = true;
  isEditing: boolean = false;

  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  displayedColumns = ['id', 'username', 'email', 'roles', 'estudiante', 'docente', 'acciones'];

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadDocentes();
    this.loadUsers();
    this.loadRoles();
  }

  toggleView(showForm: boolean): void {
    this.showForm = showForm;
    if (showForm && !this.isEditing) this.resetForm();
    if (!showForm) this.applyFilter();
  }

  applyFilter(): void {
    this.filteredUsers.filter = this.filterValue.trim().toLowerCase();
    this.updatePagedUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.registrationService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers.data = users;
        this.updatePagedUsers();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadEstudiantes(): void {
    this.registrationService.getAllEstudiantes().subscribe({
      next: (estudiantes) => (this.estudiantes = estudiantes),
      error: (err) => (this.errorMessage = 'Error al cargar estudiantes: ' + err.message)
    });
  }

  loadDocentes(): void {
    this.registrationService.getAllDocentes().subscribe({
      next: (docentes) => (this.docentes = docentes),
      error: (err) => (this.errorMessage = 'Error al cargar docentes: ' + err.message)
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

  updatePagedUsers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.filteredUsers.filteredData.slice(startIndex, endIndex);
  }

  getRolesString(user: UserDto): string {
    return user.roles.map(r => r.name).join(', ');
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedUsers();
  }

  editUser(user: UserDto): void {
    this.isEditing = true;
    this.showForm = true;
    this.registerDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: '', // Don’t prefill password
      roles: user.roles,
      estudianteId: user.estudiante?.idEstudiante,
      docenteId: user.docente?.idDocente
    };
  }

  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.loading = true;
      this.registrationService.deleteUser(userId).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar usuario: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const apiCall = this.isEditing
      ? this.registrationService.updateUser(this.registerDto.id!, this.registerDto)
      : this.registrationService.register(this.registerDto);

    apiCall.subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => location.reload(), 1500);
        } else {
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = `Error al ${this.isEditing ? 'actualizar' : 'registrar'}: ` + err.message;
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.registerDto = {
      username: '',
      email: '',
      password: '',
      roles: this.roles.find(r => r.name === 'Estudiante') ? [this.roles.find(r => r.name === 'Estudiante')!] : []
    };
    this.isEditing = false;
  }
}