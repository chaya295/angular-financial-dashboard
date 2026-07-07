import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="logo-icon">account_balance</mat-icon>
            FinDash
          </mat-card-title>
          <mat-card-subtitle>Enterprise Financial Dashboard</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="admin or viewer" />
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="form.get('username')?.hasError('required')">Username is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" />
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div *ngIf="loginError()" class="error-msg">Invalid username or password</div>

            <button mat-raised-button color="primary" type="submit" class="full-width login-btn" [disabled]="loading()">
              <mat-spinner *ngIf="loading()" diameter="20"></mat-spinner>
              <span *ngIf="!loading()">Login</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer class="hint">
          <small>Demo: admin / admin123 &nbsp;|&nbsp; viewer / viewer123</small>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
    }
    .login-card { width: 380px; padding: 16px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; font-size: 1.4rem; }
    .logo-icon { color: #1a237e; font-size: 2rem; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .login-btn { height: 44px; margin-top: 8px; }
    .error-msg { color: #f44336; font-size: 0.85rem; margin-bottom: 8px; }
    .hint { text-align: center; padding: 12px; color: #666; }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  hidePassword = signal(true);
  loading = signal(false);
  loginError = signal(false);

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.loginError.set(false);

    setTimeout(() => {
      const { username, password } = this.form.value;
      const success = this.auth.login(username!, password!);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError.set(true);
        this.loading.set(false);
      }
    }, 800);
  }
}
