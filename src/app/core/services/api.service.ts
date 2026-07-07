import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction, User, DashboardStats } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE_URL = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/users`).pipe(
      map(users => users.map((u, i) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: i % 3 === 0 ? 'admin' : 'viewer',
        status: i % 4 === 0 ? 'inactive' : 'active',
      } as User)))
    );
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/posts`).pipe(
      map(posts => posts.slice(0, 20).map((p, i) => ({
        id: p.id,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        description: p.title.slice(0, 40),
        amount: parseFloat((Math.random() * 10000 + 100).toFixed(2)),
        type: i % 2 === 0 ? 'credit' : 'debit',
        status: i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'failed' : 'completed',
        category: ['Salary', 'Transfer', 'Payment', 'Investment'][i % 4],
      } as Transaction)))
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.getTransactions().pipe(
      map(transactions => {
        const credits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
        const debits = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
        return {
          totalRevenue: parseFloat(credits.toFixed(2)),
          totalExpenses: parseFloat(debits.toFixed(2)),
          netBalance: parseFloat((credits - debits).toFixed(2)),
          pendingTransactions: transactions.filter(t => t.status === 'pending').length,
        };
      })
    );
  }
}
