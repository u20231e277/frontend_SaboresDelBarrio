import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '../../../services/user.service';
import { UserDTO, RoleDTO } from '../../../models/api-dtos.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-brand-dark">Gestión de Usuarios</h2>
        <button (click)="openCreateForm()" class="bg-brand-terra text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-wood transition-colors flex items-center gap-2">
           <lucide-icon name="user-plus" [size]="18"></lucide-icon>
           Nuevo Usuario
        </button>
      </div>

      <!-- Create/Edit Form -->
      <div *ngIf="showForm" class="bg-white p-6 rounded-2xl shadow-lg border-2 border-brand-terra/20 mb-6 animate-in fade-in slide-in-from-top-4">
         <div class="flex items-center justify-between mb-4">
           <h3 class="font-bold text-brand-dark">{{ editingUser ? 'Editar' : 'Registrar' }} Usuario</h3>
           <button (click)="closeForm()" class="text-gray-400 hover:text-gray-600">
             <lucide-icon name="x" [size]="20"></lucide-icon>
           </button>
         </div>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Nombre Completo</label>
               <input [(ngModel)]="currentUser.name" type="text" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra" placeholder="Ej. Juan Pérez">
            </div>
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Correo Electrónico</label>
               <input [(ngModel)]="currentUser.emailUser" type="email" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra" placeholder="juan@ejemplo.com">
            </div>
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Rol</label>
               <select [(ngModel)]="selectedRoleId" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra">
                  <option [ngValue]="3">Administrador</option>
                  <option [ngValue]="2">Mozo</option>
                  <option [ngValue]="1">Jefe de Cocina</option>
               </select>
            </div>
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Contraseña {{ editingUser ? '(Dejar en blanco para mantener)' : '' }}</label>
               <input [(ngModel)]="currentUser.passwordUser" type="password" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra" placeholder="********">
               <p *ngIf="currentUser.passwordUser && currentUser.passwordUser.length > 0 && currentUser.passwordUser.length < 8" class="text-xs text-red-500 mt-1">La contraseña debe tener al menos 8 caracteres.</p>
            </div>
         </div>
         <div class="mt-6 flex justify-end gap-3">
            <button (click)="closeForm()" class="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
               Cancelar
            </button>
            <button (click)="saveUser()" [disabled]="!isFormValid() || isSaving" class="bg-brand-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-wood transition-colors disabled:opacity-50 flex items-center gap-2">
               <lucide-icon *ngIf="isSaving" name="loader-2" [size]="18" class="animate-spin"></lucide-icon>
               Guardar Usuario
            </button>
         </div>
         <div *ngIf="formError" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
           {{ formError }}
         </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-brand-wood/5 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-brand-cream/30 border-b border-brand-wood/10">
              <tr>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">ID</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Nombre</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Email</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Rol</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngIf="isLoading" class="animate-pulse">
                <td colspan="5" class="px-6 py-8 text-center text-gray-400">Cargando usuarios...</td>
              </tr>
              <tr *ngIf="!isLoading && users.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-400">No hay usuarios registrados</td>
              </tr>
              <tr *ngFor="let user of users" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-500">#{{ user.idUser }}</td>
                <td class="px-6 py-4 font-medium text-brand-dark">{{ user.name }}</td>
                <td class="px-6 py-4 text-gray-600">{{ user.emailUser }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-orange-100 text-orange-700': user.idRoleUser === 1,
                          'bg-blue-100 text-blue-700': user.idRoleUser === 2,
                          'bg-purple-100 text-purple-700': user.idRoleUser === 3
                        }">
                     {{ getRoleName(user.idRoleUser).replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openEditForm(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <lucide-icon name="pencil" [size]="18"></lucide-icon>
                    </button>
                    <button (click)="deleteUser(user)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <lucide-icon name="trash-2" [size]="18"></lucide-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  userService = inject(UserService);

  users: UserDTO[] = [];
  isLoading = false;

  showForm = false;
  isSaving = false;
  editingUser = false;
  formError = '';

  selectedRoleId: number = 1;

  defaultUser: UserDTO = {
    name: '',
    emailUser: '',
    username: '',
    passwordUser: '',
    idRoleUser: 3 // Default to Administrador
  };

  currentUser: UserDTO = { ...this.defaultUser };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });
  }

  getRoleName(id: number): string {
    switch (id) {
      case 1: return 'JEFE_DE_COCINA';
      case 2: return 'MOZO';
      case 3: return 'ADMINISTRADOR';
      default: return 'DESCONOCIDO';
    }
  }

  isFormValid(): boolean {
    if (!this.currentUser.name || !this.currentUser.emailUser || !this.selectedRoleId) {
      return false;
    }
    const pwd = this.currentUser.passwordUser;

    if (!this.editingUser) {
      // New user: password is required and must be >= 8 chars
      if (!pwd || pwd.trim().length < 8) return false;
    } else {
      // Editing user: password optional, but if provided must be >= 8 chars
      if (pwd && pwd.trim().length > 0 && pwd.trim().length < 8) return false;
    }
    return true;
  }

  openCreateForm() {
    this.editingUser = false;
    this.currentUser = { ...this.defaultUser };
    this.selectedRoleId = 1;
    this.formError = '';
    this.showForm = true;
  }

  openEditForm(user: UserDTO) {
    this.editingUser = true;
    this.currentUser = { ...user };
    this.currentUser.passwordUser = ''; // Don't show existing hash/password
    this.selectedRoleId = user.idRoleUser || 1;
    this.formError = '';
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.formError = '';
  }

  saveUser() {
    this.isSaving = true;
    this.formError = '';

    // Assign role
    this.currentUser.idRoleUser = this.selectedRoleId;
    // Generate a default username if empty
    if (!this.currentUser.username) {
      this.currentUser.username = this.currentUser.name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 100);
    }

    if (this.editingUser && this.currentUser.idUser) {
      // Send 8 spaces if empty. Backend @Size(min=8) and @NotEmpty require it,
      // but backend's isBlank() check will ignore spaces and prevent password overwrite.
      if (!this.currentUser.passwordUser || this.currentUser.passwordUser.trim() === '') {
        this.currentUser.passwordUser = '        '; // 8 spaces
      }

      this.userService.updateUser(this.currentUser.idUser, this.currentUser).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeForm();
          this.loadUsers();
        },
        error: (err) => {
          this.isSaving = false;
          this.formError = 'Error al actualizar el usuario. Verifique los datos o si el correo ya existe.';
          console.error(err);
        }
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeForm();
          this.loadUsers();
        },
        error: (err) => {
          this.isSaving = false;
          this.formError = 'Error al crear el usuario. Verifique los datos o si el correo ya existe.';
          console.error(err);
        }
      });
    }
  }

  deleteUser(user: UserDTO) {
    if (confirm(`¿Está seguro que desea eliminar a ${user.name}?`)) {
      if (user.idUser) {
        this.userService.deleteUser(user.idUser).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            alert('No se pudo eliminar el usuario.');
          }
        });
      }
    }
  }
}
