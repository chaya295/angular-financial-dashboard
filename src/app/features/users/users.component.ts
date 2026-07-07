import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../shared/models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatTableModule, MatChipsModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatTooltipModule, MatSnackBarModule,
  ],
  template: `
    <h1 class="page-title">User Management</h1>

    <div *ngIf="loading(); else content" class="spinner-wrap">
      <mat-spinner></mat-spinner>
    </div>

    <ng-template #content>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="users()" class="full-width">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let u">
                <div class="user-cell">
                  <div class="avatar">{{ u.name[0] }}</div>
                  {{ u.name }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let u">{{ u.email }}</td>
            </ng-container>
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let u">
                <span class="badge" [class]="u.role">{{ u.role }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let u">
                <span class="badge" [class]="u.status">{{ u.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let u">
                <button mat-icon-button color="primary" matTooltip="Edit" (click)="onEdit(u)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" matTooltip="Toggle status" (click)="toggleStatus(u)">
                  <mat-icon>{{ u.status === 'active' ? 'block' : 'check_circle' }}</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,
  styles: [`
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: #1a237e; color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 0.85rem;
    }
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; }
    .badge.admin { background: #e8eaf6; color: #1a237e; }
    .badge.viewer { background: #f3e5f5; color: #6a1b9a; }
    .badge.active { background: #e8f5e9; color: #2e7d32; }
    .badge.inactive { background: #ffebee; color: #c62828; }
  `],
})
export class UsersComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  users = signal<User[]>([]);
  columns = ['name', 'email', 'role', 'status', 'actions'];

  ngOnInit(): void {
    this.api.getUsers().subscribe(u => {
      this.users.set(u);
      this.loading.set(false);
    });
  }

  toggleStatus(user: User): void {
    this.users.update(users =>
      users.map(u => u.id === user.id
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
      )
    );
    this.snackBar.open(`${user.name} status updated`, 'Close', { duration: 2000 });
  }

  onEdit(user: User): void {
    this.snackBar.open(`Editing ${user.name}`, 'Close', { duration: 2000 });
  }
}
