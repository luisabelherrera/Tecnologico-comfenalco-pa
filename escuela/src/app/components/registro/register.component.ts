import { Component, OnInit } from '@angular/core';
import { RegisterDto, RoleDto, UserDto } from 'src/app/models/models';
import { RegistrationService } from 'src/app/services/auth/Registration.service';
import { PageEvent } from '@angular/material/paginator';
import { Docente } from 'src/app/models/entity/docente.model';
import { DocenteService } from 'src/app/services/Docente/Docente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerDto: RegisterDto = {
    username: '',
    email: '',
    password: '',
    roles: [],
    docenteInfo: null
  };

  roles: RoleDto[] = [];
  docentes: Docente[] = [];
  registeredUsers: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  paginatedUsers: UserDto[] = [];
  pageSize = 5;
  currentPage = 0;
  isSubmitting = false; 
  errorMessage: string | null = null; 

  constructor(private registrationService: RegistrationService, private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadDocentes();
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

  loadRegisteredUsers(): void {
    this.registrationService.getAllUsers().subscribe(
      (data) => {
        this.registeredUsers = data;
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
        this.resetForm(); // Reset the form after successful registration
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
      username: '',
      email: '',
      password: '',
      roles: [],
      docenteInfo: null
    };
  }

  deleteUser(userId: number): void {
    if (!userId) {
      console.error('User ID is undefined or null!');
      return;
    }

    if (confirm("Are you sure you want to delete this user?")) {
      this.registrationService.deleteUser(userId).subscribe(
        (response) => {
          console.log('User deleted successfully!', response);
          this.loadRegisteredUsers();
        },
        (error) => {
          console.error('Error deleting user', error);
          this.errorMessage = error.message || 'Failed to delete user.';
        }
      );
    }
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
}
