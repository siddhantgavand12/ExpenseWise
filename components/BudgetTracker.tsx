import React, { useState } from 'react';
import { Budget, Expense, UserCategory } from '../types';
import { EditIcon, DeleteIcon, SaveIcon, CancelIcon, PlusIcon, AllIcons, PlusCircleIcon } from './icons';

interface BudgetTrackerProps {
  budgets: Budget[];
  expenses: Expense[];
  categories: UserCategory[];
  updateBudget: (category: string, amount: number) => void;
  addBudget: (budget: Budget) => void;
  requestDeleteCategory: (category: string) => void;
  onAddCategoryClick: () => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budgets, expenses, categories, updateBudget, addBudget, requestDeleteCategory, onAddCategoryClick }) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedAmount, setEditedAmount] = useState<string>('');
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<string>('');

  const getCategoryTotalExpense = (category: string) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const handleEditClick = (budget: Budget) => {
    setEditingCategory(budget.category);
    setEditedAmount(budget.amount.toString());
  };
  
  const handleSaveClick = () => {
    if (editingCategory && editedAmount) {
      updateBudget(editingCategory, parseFloat(editedAmount));
    }
    setEditingCategory(null);
    setEditedAmount('');
  };

  const handleAddClick = (category: string) => {
    setAddingCategory(category);
  }

  const handleSaveNewBudget = () => {
    if (addingCategory && newAmount) {
        addBudget({ category: addingCategory, amount: parseFloat(newAmount) });
    }
    setAddingCategory(null);
    setNewAmount('');
  }

  const budgetedCategories = new Set(budgets.map(b => b.category));
  const unbudgetedCategories = categories.filter(c => !budgetedCategories.has(c.name));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Budget Tracker</h2>
        <button 
            onClick={onAddCategoryClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors"
        >
            <PlusCircleIcon className="w-5 h-5" />
            Add Category
        </button>
      </div>
      
      {/* Budgeted Categories */}
      <div className="space-y-4">
        {budgets.length === 0 && <p className="text-gray-500 dark:text-gray-400">No budgets set yet. Choose a category below to start.</p>}
        {budgets.map(budget => {
          const spent = getCategoryTotalExpense(budget.category);
          const remaining = budget.amount - spent;
          const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
          const progressBarColor = percentage > 100 ? 'bg-red-500' : (percentage > 75 ? 'bg-yellow-500' : 'bg-green-500');

          return (
            <div key={budget.category}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{budget.category}</span>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    {editingCategory === budget.category ? (
                      <>
                        <button onClick={handleSaveClick} className="text-primary-500 hover:text-primary-700">
                          <SaveIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-gray-600">
                          <CancelIcon className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span>₹{spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}</span>
                        <button onClick={() => handleEditClick(budget)} className="text-gray-400 hover:text-primary-500">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestDeleteCategory(budget.category)}
                          className="text-gray-400 hover:text-red-500 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                          disabled={budget.category === 'Other'}
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                </div>
              </div>
              {editingCategory === budget.category ? (
                <input 
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              ) : (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unbudgeted Categories */}
      { unbudgetedCategories.length > 0 && 
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Set New Budgets</h3>
            <div className="space-y-3">
            {unbudgetedCategories.map(category => {
                if (addingCategory === category.name) {
                    return (
                        <div key={category.name} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-primary-500">{AllIcons[category.icon]}</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number"
                                    placeholder="Amount"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    className="w-24 bg-white dark:bg-gray-700 p-1 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                                    autoFocus
                                />
                                <button onClick={handleSaveNewBudget} className="text-primary-500 hover:text-primary-700"><SaveIcon className="w-4 h-4" /></button>
                                <button onClick={() => setAddingCategory(null)} className="text-gray-400 hover:text-gray-600"><CancelIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )
                }
                return (
                <div key={category.name} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-primary-500">{AllIcons[category.icon]}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleAddClick(category.name)} className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                            <PlusIcon className="w-4 h-4" /> Set Budget
                        </button>
                        <button
                        onClick={() => requestDeleteCategory(category.name)}
                        className="text-gray-400 hover:text-red-500 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                        disabled={category.name === 'Other'}>
                            <DeleteIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                )
            })}
            </div>
        </div>
      }
    </div>
  );
};

export default BudgetTracker;