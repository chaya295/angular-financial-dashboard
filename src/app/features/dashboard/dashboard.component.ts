import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats, Transaction } from '../../shared/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  template: `
    <h1 class="page-title">Dashboard</h1>

    <div *ngIf="loading(); else content" class="spinner-wrap">
      <mat-spinner></mat-spinner>
    </div>

    <ng-template #content>
      <div class="stats-grid" *ngIf="stats()">
        <div class="stat-card">
          <div class="stat-icon green"><mat-icon>trending_up</mat-icon></div>
          <div class="stat-info">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">{{ stats()!.totalRevenue | currency }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><mat-icon>trending_down</mat-icon></div>
          <div class="stat-info">
            <div class="stat-label">Total Expenses</div>
            <div class="stat-value">{{ stats()!.totalExpenses | currency }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><mat-icon>account_balance_wallet</mat-icon></div>
          <div class="stat-info">
            <div class="stat-label">Net Balance</div>
            <div class="stat-value" [class.negative]="stats()!.netBalance < 0">
              {{ stats()!.netBalance | currency }}
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><mat-icon>pending_actions</mat-icon></div>
          <div class="stat-info">
            <div class="stat-label">Pending Transactions</div>
            <div class="stat-value">{{ stats()!.pendingTransactions }}</div>
          </div>
        </div>
      </div>

      <mat-card class="recent-card">
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
          <span class="spacer"></span>
          <a mat-button color="primary" routerLink="/transactions">View All</a>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let t of recentTransactions()" class="transaction-row">
            <mat-icon [class]="t.type === 'credit' ? 'credit-icon' : 'debit-icon'">
              {{ t.type === 'credit' ? 'arrow_downward' : 'arrow_upward' }}
            </mat-icon>
            <div class="t-info">
              <div class="t-desc">{{ t.description }}</div>
              <div class="t-date">{{ t.date }} · {{ t.category }}</div>
            </div>
            <div [class]="'t-amount ' + t.type">
              {{ t.type === 'credit' ? '+' : '-' }}{{ t.amount | currency }}
            </div>
            <span class="badge" [class]="t.status">{{ t.status }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,
  styles: [`
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 16px; }
    .stat-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .stat-icon.green { background: #e8f5e9; color: #2e7d32; }
    .stat-icon.red { background: #ffebee; color: #c62828; }
    .stat-icon.blue { background: #e3f2fd; color: #1565c0; }
    .stat-icon.orange { background: #fff3e0; color: #e65100; }
    .stat-label { font-size: 0.8rem; color: #666; }
    .stat-value { font-size: 1.3rem; font-weight: 700; color: #1a237e; }
    .stat-value.negative { color: #c62828; }
    .recent-card { margin-top: 8px; }
    mat-card-header { display: flex; align-items: center; }
    .spacer { flex: 1; }
    .transaction-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .credit-icon { color: #2e7d32; }
    .debit-icon { color: #c62828; }
    .t-info { flex: 1; }
    .t-desc { font-size: 0.9rem; font-weight: 500; }
    .t-date { font-size: 0.75rem; color: #888; }
    .t-amount { font-weight: 600; }
    .t-amount.credit { color: #2e7d32; }
    .t-amount.debit { color: #c62828; }
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; }
    .badge.completed { background: #e8f5e9; color: #2e7d32; }
    .badge.pending { background: #fff3e0; color: #e65100; }
    .badge.failed { background: #ffebee; color: #c62828; }
  `],
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  loading = signal(true);
  stats = signal<DashboardStats | null>(null);
  recentTransactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe(s => {
      this.stats.set(s);
      this.loading.set(false);
    });
    this.api.getTransactions().subscribe(t => this.recentTransactions.set(t.slice(0, 5)));
  }
}
