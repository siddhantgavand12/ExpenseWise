import React, { useState } from 'react';
import { Budget, Expense, UserCategory } from '../types';
import BudgetTracker from '../components/BudgetTracker';
import ConfirmationToast from '../components/ConfirmationToast';
import { PlusIcon } from '../components/icons';
import BudgetAdjuster from '../components/BudgetAdjuster';
import Modal from '../components/Modal';

interface BudgetManagementProps {
  budgets: Budget[];
  expenses: Expense[];
  categories: UserCategory[];
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
  updateBudget: (category: string, amount: number) => void;
  addBudget: (budget: Budget) => void;
  deleteCategoryAndData: (categoryName: string) => void;
  addCategory: (categoryName: string) => Promise<void>;
}

const BudgetManagement: React.FC<BudgetManagementProps> = (props) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const requestDeleteCategory = (categoryName: string) => {
    setPendingDeleteCategory(categoryName);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteCategory) {
      props.deleteCategoryAndData(pendingDeleteCategory);
    }
    setPendingDeleteCategory(null);
  };

  const handleCancelDelete = () => {
    setPendingDeleteCategory(null);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;
    setIsAdding(true);
    try {
        await props.addCategory(newCategoryName.trim());
        setNewCategoryName('');
        setIsCategoryModalOpen(false); // Close modal on success
    } catch (error) {
        console.error("Failed to add category", error);
    } finally {
        setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
        <BudgetTracker {...props} requestDeleteCategory={requestDeleteCategory} onAddCategoryClick={() => setIsCategoryModalOpen(true)} />

        <BudgetAdjuster monthlyBudget={props.monthlyBudget} setMonthlyBudget={props.setMonthlyBudget} />

        <ConfirmationToast
            isVisible={!!pendingDeleteCategory}
            message={`Delete '${pendingDeleteCategory}'? This will remove the category and all its expenses.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
        />

        <Modal title="Add New Category" isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
            <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                    <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                    <input 
                        id="newCategory"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., 'Travel'"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button 
                        type="button"
                        onClick={() => setIsCategoryModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isAdding}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 dark:focus:ring-offset-gray-800"
                    >
                        {isAdding ? 'Adding...' : 'Add Category'}
                    </button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default BudgetManagement;