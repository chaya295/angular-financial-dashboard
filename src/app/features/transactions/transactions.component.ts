import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { Transaction } from '../../shared/models/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
  ],
  template: `
    <h1 class="page-title">Transactions</h1>

    <div *ngIf="loading(); else content" class="spinner-wrap">
      <mat-spinner></mat-spinner>
    </div>

    <ng-template #content>
      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Description..." />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select [(ngModel)]="typeFilter" (ngModelChange)="applyFilter()">
                <mat-option value="">All</mat-option>
                <mat-option value="credit">Credit</mat-option>
                <mat-option value="debit">Debit</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()">
                <mat-option value="">All</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="failed">Failed</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="filtered()" class="full-width">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let t">{{ t.date }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let t">{{ t.description }}</td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let t">{{ t.category }}</td>
            </ng-container>
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let t" [class]="t.type">
                {{ t.type === 'credit' ? '+' : '-' }}{{ t.amount | currency }}
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let t">
                <span class="badge" [class]="t.status">{{ t.status }}</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          <div class="no-data" *ngIf="filtered().length === 0">No transactions found</div>
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,
  styles: [`
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .filters { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
    .filters mat-form-field { min-width: 180px; }
    .full-width { width: 100%; }
    .credit { color: #2e7d32; font-weight: 600; }
    .debit { color: #c62828; font-weight: 600; }
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; }
    .badge.completed { background: #e8f5e9; color: #2e7d32; }
    .badge.pending { background: #fff3e0; color: #e65100; }
    .badge.failed { background: #ffebee; color: #c62828; }
    .no-data { text-align: center; padding: 32px; color: #888; }
  `],
})
export class TransactionsComponent implements OnInit {
  private api = inject(ApiService);

  loading = signal(true);
  transactions = signal<Transaction[]>([]);
  filtered = signal<Transaction[]>([]);
  columns = ['date', 'description', 'category', 'amount', 'status'];
  searchTerm = '';
  typeFilter = '';
  statusFilter = '';

  ngOnInit(): void {
    this.api.getTransactions().subscribe(t => {
      this.transactions.set(t);
      this.filtered.set(t);
      this.loading.set(false);
    });
  }

  applyFilter(): void {
    this.filtered.set(
      this.transactions().filter(t =>
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.typeFilter ? t.type === this.typeFilter : true) &&
        (this.statusFilter ? t.status === this.statusFilter : true)
      )
    );
  }
}
