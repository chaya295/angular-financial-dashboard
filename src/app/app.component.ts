import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
  ],
  template: `
    <div [class]="isDark() ? 'dark-theme app-wrapper' : 'app-wrapper'">
      <ng-container *ngIf="auth.isLoggedIn(); else noNav">
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenavOpen.set(!sidenavOpen())">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="brand">FinDash</span>
          <span class="spacer"></span>
          <span class="user-info">{{ auth.currentUser()?.username }} ({{ auth.currentUser()?.role }})</span>
          <button mat-icon-button [matTooltip]="isDark() ? 'Light mode' : 'Dark mode'" (click)="isDark.set(!isDark())">
            <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Logout" (click)="auth.logout()">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav [opened]="sidenavOpen()" mode="side" class="sidenav">
            <mat-nav-list>
              <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                <span matListItemTitle>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/transactions" routerLinkActive="active-link">
                <mat-icon matListItemIcon>receipt_long</mat-icon>
                <span matListItemTitle>Transactions</span>
              </a>
              <a mat-list-item routerLink="/users" routerLinkActive="active-link">
                <mat-icon matListItemIcon>group</mat-icon>
                <span matListItemTitle>Users</span>
              </a>
            </mat-nav-list>
          </mat-sidenav>
          <mat-sidenav-content class="main-content">
            <router-outlet />
          </mat-sidenav-content>
        </mat-sidenav-container>
      </ng-container>

      <ng-template #noNav>
        <router-outlet />
      </ng-template>
    </div>
  `,
  styles: [`
    .app-wrapper { height: 100vh; display: flex; flex-direction: column; }
    .toolbar { position: sticky; top: 0; z-index: 100; }
    .brand { font-size: 1.2rem; font-weight: 700; margin-left: 8px; }
    .spacer { flex: 1; }
    .user-info { font-size: 0.85rem; margin-right: 12px; opacity: 0.9; }
    .sidenav-container { flex: 1; }
    .sidenav { width: 220px; padding-top: 8px; }
    .main-content { padding: 24px; }
    .active-link { background: rgba(0,0,0,0.08); border-radius: 4px; }
    .dark-theme { background: #121212; color: #fff; }
  `],
})
export class AppComponent {
  auth = inject(AuthService);
  sidenavOpen = signal(true);
  isDark = signal(false);
}
