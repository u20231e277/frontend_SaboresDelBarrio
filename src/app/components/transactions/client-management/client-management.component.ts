import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { ClientDTO } from '../../../models/api-dtos.model';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  salesService = inject(SalesService);
  fb = inject(FormBuilder);
  router = inject(Router);

  clients: ClientDTO[] = [];
  isLoading = false;

  // Modal states
  showModal = false;
  modalMode: 'ADD' | 'EDIT' = 'ADD';
  showDeleteConfirm = false;
  clientToDelete: ClientDTO | null = null;

  form: FormGroup = this.fb.group({
    idClient: [null],
    nameOfClient: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required]],
    emailClient: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.salesService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading clients', err);
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.modalMode = 'ADD';
    this.form.reset();
    this.showModal = true;
  }

  openEditModal(client: ClientDTO): void {
    this.modalMode = 'EDIT';
    this.form.patchValue(client);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const clientData: ClientDTO = this.form.value;

    if (this.modalMode === 'ADD') {
      // Remove idClient for creation if needed, or backend handles it
      delete clientData.idClient;
      this.salesService.createClient(clientData).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Error creating client', err)
      });
    } else {
      const id = clientData.idClient!;
      this.salesService.updateClient(id, clientData).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Error updating client', err)
      });
    }
  }

  confirmDelete(client: ClientDTO): void {
    this.clientToDelete = client;
    this.showDeleteConfirm = true;
  }

  deleteClient(): void {
    if (!this.clientToDelete || !this.clientToDelete.idClient) return;

    this.salesService.deleteClient(this.clientToDelete.idClient).subscribe({
      next: () => {
        this.loadClients();
        this.showDeleteConfirm = false;
        this.clientToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting client', err);
        this.showDeleteConfirm = false;
        this.clientToDelete = null;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/ventas']);
  }
}
