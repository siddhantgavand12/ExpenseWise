import React, { useState } from 'react';
import SummaryCards from '../components/SummaryCards';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import { Expense, UserCategory } from '../types';

interface DashboardProps {
  expenses: Expense[];
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
  categories: UserCategory[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  resetExpenses: () => void;
  archivedSpend: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  monthlyBudget,
  setMonthlyBudget,
  categories,
  addExpense,
  updateExpense,
  deleteExpense,
  resetExpenses,
  archivedSpend,
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;
  
  const todaysExpenses = expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) + archivedSpend;
  const remainingBudget = monthlyBudget - totalExpenses;

  return (
    <div className="space-y-6">
      <SummaryCards
        todaysExpenses={todaysExpenses}
        totalExpenses={totalExpenses}
        monthlyBudget={monthlyBudget}
        setMonthlyBudget={setMonthlyBudget}
        remainingBudget={remainingBudget}
        isBalanceVisible={isBalanceVisible}
        setIsBalanceVisible={setIsBalanceVisible}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExpenseForm addExpense={addExpense} categories={categories} />
        </div>
        <div className="lg:col-span-2">
          <ExpenseTable
            expenses={expenses}
            categories={categories}
            updateExpense={updateExpense}
            deleteExpense={deleteExpense}
            resetExpenses={resetExpenses}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
