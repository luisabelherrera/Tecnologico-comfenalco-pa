import { Component, OnInit } from '@angular/core';
import { RegisterDto, RoleDto, UserDto } from 'src/app/models/models';
import { RegistrationService } from 'src/app/services/auth/Registration.service';
import { PageEvent } from '@angular/material/paginator';
import { Docente } from 'src/app/models/entity/docente.model';
import { DocenteService } from 'src/app/services/Docente/Docente.service';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  selectedDomain: string = '@gmail.com';  
  registerDto = {
    id: 0,
    username: '',
    email: '', 
    password: '',
    roles: [],
    userType: '', 
    docenteInfo: null,
    estudianteInfo: null,
  };
  roles: RoleDto[] = [];
  docentes: Docente[] = [];
  estudiantes: Estudiante[] = [];  
  registeredUsers: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  paginatedUsers: UserDto[] = [];
  pageSize = 5;
  currentPage = 0;
  isSubmitting = false; 
  errorMessage: string | null = null; 

  constructor(
    private registrationService: RegistrationService, 
    private docenteService: DocenteService,
    private estudianteService: EstudianteService 
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadDocentes();
    this.loadEstudiantes(); 
    this.loadRegisteredUsers();
  }

  loadRoles(): void {
    this.registrationService.getAllRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error loading roles', error);
      }
    );
  }

  loadDocentes(): void {
    this.docenteService.getAllDocentes().subscribe(
      (data) => {
        this.docentes = data;
      },
      (error) => {
        console.error('Error loading docentes', error);
      }
    );
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe(
      (data) => {
        this.estudiantes = data;
      },
      (error) => {
        console.error('Error loading estudiantes', error);
      }
    );
  }

  loadRegisteredUsers(): void {
    this.registrationService.getAllUsers().subscribe(
      (data) => {
        this.registeredUsers = data;
        console.log('Registered Users:', this.registeredUsers); 
        this.filteredUsers = [...this.registeredUsers];
        this.updatePaginatedUsers();
      },
      (error) => {
        console.error('Error loading registered users', error);
      }
    );
  }
  

  register(): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.registrationService.register(this.registerDto).subscribe(
        (response) => {
            console.log('User registered successfully!', response);
            this.loadRegisteredUsers();
            this.resetForm();
            
            alert('User registered successfully!'); 
        },
        (error) => {
            console.error('Error during registration', error);
            this.errorMessage = error.message || 'Registration failed. Please try again.';
        },
        () => {
            this.isSubmitting = false;
        }
    );
}

  resetForm(): void {
    this.registerDto = {
      id: 0,
      username: '',
      email: '',
      password: '',
      roles: [],
      userType: '', 
      docenteInfo: null,
      estudianteInfo: null 
    };
  }
  deleteUser(userId: number): void {
    console.log('Attempting to delete user with ID:', userId);  
    this.registrationService.deleteUser(userId).subscribe(
        response => {
            console.log(response.message);
            this.loadRegisteredUsers();  
        },
        error => {
            console.error('Error deleting user:', error);
        }
    );
}

  
  
  
  

  getRoles(roles: RoleDto[]): string {
    return roles.map(role => role.name).join(', ');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.registeredUsers.filter(user =>
      user.username.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }
  updateEmail() {
    if (this.registerDto.username) {
      this.registerDto.email = `${this.registerDto.username}@gmail.com`;
    } else {
      this.registerDto.email = '';
    }
  }
  

 
  onUserTypeChange(userType: string): void {
    this.registerDto.userType = userType;
    if (userType === 'docente') {
      this.registerDto.estudianteInfo = null; 
    } else {
      this.registerDto.docenteInfo = null;  
    }
  }
}
