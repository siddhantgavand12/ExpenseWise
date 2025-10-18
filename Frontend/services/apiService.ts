import { Expense, UserCategory, Budget } from '../types';

const API_BASE_URL = 'https://expensewise-59d8.onrender.com'; // Your server URL

// Helper function for handling API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

// Global State (monthly budget, etc.)
export const getGlobalState = async () => {
    const response = await fetch(`${API_BASE_URL}/state`);
    return handleResponse<{ monthlyBudget: number; archivedSpend: number }>(response);
};

export const updateGlobalState = async (data: { monthlyBudget?: number; archivedSpend?: number }) => {
    const response = await fetch(`${API_BASE_URL}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<{ monthlyBudget: number; archivedSpend: number }>(response);
};

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  return handleResponse<Expense[]>(response);
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(response);
};

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  const response = await fetch(`${API_BASE_URL}/expenses/${expense.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(response);
};

export const deleteExpense = async (id: string): Promise<{}> => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{}>(response);
};

export const resetExpenses = async (): Promise<{ monthlyBudget: number, archivedSpend: number }> => {
    const response = await fetch(`${API_BASE_URL}/expenses/reset`, { method: 'POST' });
    return handleResponse<{ monthlyBudget: number, archivedSpend: number }>(response);
}

// Categories
export const getCategories = async (): Promise<UserCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse<UserCategory[]>(response);
};

export const addCategory = async (name: string): Promise<UserCategory> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    return handleResponse<UserCategory>(response);
};

export const deleteCategory = async (name: string): Promise<{}> => {
    const response = await fetch(`${API_BASE_URL}/categories/${name}`, {
        method: 'DELETE',
    });
    return handleResponse<{}>(response);
};

// Budgets
export const getBudgets = async (): Promise<Budget[]> => {
    const response = await fetch(`${API_BASE_URL}/budgets`);
    return handleResponse<Budget[]>(response);
};

export const addOrUpdateBudget = async (budget: Budget): Promise<Budget> => {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
    });
    return handleResponse<Budget>(response);
};
