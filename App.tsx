import React, { useState, useEffect } from 'react';
import { Expense, UserCategory, Budget } from './types';
import * as api from './services/apiService';
import Header from './components/Header';
import { Router, Route } from './components/Router';
import Dashboard from './pages/Dashboard';
import BudgetManagement from './pages/BudgetManagement';
import ChartsPage from './pages/Charts';
import AiAdvisor from './pages/AiAdvisor';
import Reports from './pages/Reports';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [archivedSpend, setArchivedSpend] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [
          expensesData,
          categoriesData,
          budgetsData,
          globalStateData,
        ] = await Promise.all([
          api.getExpenses(),
          api.getCategories(),
          api.getBudgets(),
          api.getGlobalState(),
        ]);
        setExpenses(expensesData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
        if (globalStateData) {
            setMonthlyBudget(globalStateData.monthlyBudget);
            setArchivedSpend(globalStateData.archivedSpend);
        }
      } catch (error) {
        console.error("Failed to load data from server:", error);
        // Here you could set an error state and display a message to the user
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Expense Handlers
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense = await api.addExpense(expense);
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = async (updatedExpense: Expense) => {
    const result = await api.updateExpense(updatedExpense);
    setExpenses(prev => prev.map(e => (e.id === result.id ? result : e)));
  };

  const deleteExpense = async (id: string) => {
    await api.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const resetExpenses = async () => {
    const { monthlyBudget: newMonthlyBudget, archivedSpend: newArchivedSpend } = await api.resetExpenses();
    setMonthlyBudget(newMonthlyBudget);
    setArchivedSpend(newArchivedSpend);
    setExpenses([]);
  };

  // Budget Handlers
  const addBudget = async (budget: Budget) => {
    const newBudget = await api.addOrUpdateBudget(budget);
    setBudgets(prev => [newBudget, ...prev.filter(b => b.category !== newBudget.category)]);
  };

  const updateBudget = async (category: string, amount: number) => {
    const updatedBudget = await api.addOrUpdateBudget({ category, amount });
    setBudgets(prev => prev.map(b => (b.category === updatedBudget.category ? updatedBudget : b)));
  };

  // Category Handlers
  const addCategory = async (categoryName: string): Promise<void> => {
    const newCategory = await api.addCategory(categoryName);
    setCategories(prev => [newCategory, ...prev]);
  };

  const deleteCategoryAndData = async (categoryName: string) => {
    if (categoryName === 'Other') {
        alert("The 'Other' category cannot be deleted.");
        return;
    }
    await api.deleteCategory(categoryName);
    // Refetch data to ensure consistency
    const [expensesData, categoriesData, budgetsData] = await Promise.all([
        api.getExpenses(),
        api.getCategories(),
        api.getBudgets(),
    ]);
    setExpenses(expensesData);
    setCategories(categoriesData);
    setBudgets(budgetsData);
  };

  const handleSetMonthlyBudget = async (value: number) => {
    const newGlobalState = await api.updateGlobalState({ monthlyBudget: value });
    setMonthlyBudget(newGlobalState.monthlyBudget);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading your financial data...</p>
            </div>
        </div>
    );
  }

  const pageProps = {
    expenses,
    categories,
    budgets,
    monthlyBudget,
    setMonthlyBudget: handleSetMonthlyBudget,
    archivedSpend
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <Header />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Route path="/">
            <Dashboard
              {...pageProps}
              addExpense={addExpense}
              updateExpense={updateExpense}
              deleteExpense={deleteExpense}
              resetExpenses={resetExpenses}
            />
          </Route>
          <Route path="/budgets">
            <BudgetManagement
              {...pageProps}
              updateBudget={updateBudget}
              addBudget={addBudget}
              deleteCategoryAndData={deleteCategoryAndData}
              addCategory={addCategory}
            />
          </Route>
          <Route path="/charts">
            <ChartsPage {...pageProps} />
          </Route>
          <Route path="/reports">
            <Reports {...pageProps} />
          </Route>
          <Route path="/ai-advisor">
            <AiAdvisor {...pageProps} />
          </Route>
        </main>
      </div>
    </Router>
  );
};

export default App;
