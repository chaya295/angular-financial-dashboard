export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  pendingTransactions: number;
}

export interface AuthUser {
  username: string;
  role: 'admin' | 'viewer';
  token: string;
}
