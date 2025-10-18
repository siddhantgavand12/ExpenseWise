
export interface UserCategory {
  name: string;
  icon: string; // key for the icon component
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  notes: string;
}

export interface Budget {
  category: string;
  amount: number;
}
