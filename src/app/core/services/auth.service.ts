import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly MOCK_USERS = [
    { username: 'admin', password: 'admin123', role: 'admin' as const },
    { username: 'viewer', password: 'viewer123', role: 'viewer' as const },
  ];

  currentUser = signal<AuthUser | null>(null);

  constructor(private router: Router) {
    const stored = localStorage.getItem('auth_user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  login(username: string, password: string): boolean {
    const match = this.MOCK_USERS.find(u => u.username === username && u.password === password);
    if (!match) return false;
    const user: AuthUser = { username: match.username, role: match.role, token: btoa(username + ':' + Date.now()) };
    this.currentUser.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('auth_user');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
