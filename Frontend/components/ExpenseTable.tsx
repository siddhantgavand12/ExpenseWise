import React, { useState } from 'react';
import { Expense, UserCategory } from '../types';
import { EditIcon, DeleteIcon, SaveIcon, CancelIcon, AllIcons, RefreshIcon } from './icons';
import ConfirmationToast from './ConfirmationToast';

interface ExpenseTableProps {
  expenses: Expense[];
  categories: UserCategory[];
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  resetExpenses: () => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, categories, updateExpense, deleteExpense, resetExpenses }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showResetToast, setShowResetToast] = useState(false);

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditedExpense({ ...expense });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedExpense(null);
  };

  const handleSave = () => {
    if (editedExpense) {
      updateExpense(editedExpense);
    }
    handleCancelEdit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedExpense) {
      const { name, value } = e.target;
      setEditedExpense({
        ...editedExpense,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value,
      });
    }
  };
  
  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
        deleteExpense(pendingDeleteId);
    }
    setPendingDeleteId(null);
  }

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  }

  const handleRequestReset = () => {
    setShowResetToast(true);
  };

  const handleConfirmReset = () => {
    resetExpenses();
    setShowResetToast(false);
  };

  const handleCancelReset = () => {
    setShowResetToast(false);
  };

  const sortedExpenses = [...expenses].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recent Expenses</h2>
        {expenses.length > 0 && (
            <button
                onClick={handleRequestReset}
                className="flex items-center gap-2 px-3 py-1 border border-red-500/50 text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 text-xs font-medium rounded-md transition-colors"
                aria-label="Reset all expenses"
            >
                <RefreshIcon className="w-4 h-4" />
                Reset
            </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
              <th scope="col" className="relative px-2 sm:px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedExpenses.map((expense) => (
              <tr key={expense.id}>
                {editingId === expense.id && editedExpense ? (
                  <>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <input type="date" name="date" value={editedExpense.date} onChange={handleChange} className="w-full bg-transparent border-b dark:border-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"/>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <select name="category" value={editedExpense.category} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-600 focus:outline-none text-gray-900 dark:text-gray-100">
                        {categories.map(cat => <option className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" key={cat.name} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                       <input type="number" name="amount" value={editedExpense.amount} onChange={handleChange} className="w-full bg-transparent border-b dark:border-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"/>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                       <input type="text" name="notes" value={editedExpense.notes} onChange={handleChange} className="w-full bg-transparent border-b dark:border-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"/>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2">
                       <button onClick={handleSave} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200"><SaveIcon /></button>
                       <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"><CancelIcon /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(`${expense.date}T00:00:00`).toLocaleDateString('en-IN')}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                           {AllIcons[categories.find(c => c.name === expense.category)?.icon || 'other']}
                           <span className="truncate">{expense.category}</span>
                        </div>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₹{expense.amount.toFixed(2)}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate max-w-[100px] sm:max-w-xs">{expense.notes}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                      <button onClick={() => handleEdit(expense)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200"><EditIcon /></button>
                      <button onClick={() => requestDelete(expense.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><DeleteIcon /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
             {sortedExpenses.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No expenses recorded yet.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationToast
        isVisible={!!pendingDeleteId}
        message="Are you sure you want to delete this expense?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
      />
      <ConfirmationToast
        isVisible={showResetToast}
        message="Are you sure you want to delete all expenses?"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
        confirmText="Reset All"
      />
    </div>
  );
};

export default ExpenseTable;