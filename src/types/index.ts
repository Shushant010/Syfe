
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currency: 'INR' | 'USD';
  savedAmount: number;
  contributions: Contribution[];
  createdAt: Date;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  goalId: string;
}

export interface ExchangeRate {
  rate: number;
  lastUpdated: string;
}

export interface DashboardStats {
  totalTarget: number;
  totalSaved: number;
  overallProgress: number;
}
