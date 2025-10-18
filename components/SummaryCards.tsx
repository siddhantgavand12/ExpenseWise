import React, { useState, useEffect } from 'react';
import { EditIcon, SaveIcon, EyeIcon, EyeSlashIcon } from './icons';

interface SummaryCardsProps {
  todaysExpenses: number;
  totalExpenses: number;
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
  remainingBudget: number;
  isBalanceVisible: boolean;
  setIsBalanceVisible: (value: boolean) => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  todaysExpenses,
  totalExpenses, 
  monthlyBudget, 
  setMonthlyBudget, 
  remainingBudget, 
  isBalanceVisible, 
  setIsBalanceVisible 
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedBudget, setEditedBudget] = useState(monthlyBudget.toString());

  useEffect(() => {
    setEditedBudget(monthlyBudget.toString());
  }, [monthlyBudget]);

  const handleSaveBudget = () => {
    const newAmount = parseFloat(editedBudget);
    if (!isNaN(newAmount) && newAmount >= 0) {
      setMonthlyBudget(newAmount);
    }
    setIsEditingBudget(false);
  };

  const getStatusColor = () => {
    if (monthlyBudget <= 0) return 'text-gray-500 dark:text-gray-400';
    const percentage = (totalExpenses / monthlyBudget) * 100;
    if (percentage > 100) return 'text-red-500 dark:text-red-400';
    if (percentage > 75) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  const Card: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex-1">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Today's Spent Card */}
      <Card title="Today's Spent">
        <p className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
          ₹{todaysExpenses.toFixed(2)}
        </p>
      </Card>

      {/* New Combined Budget Overview Card */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Overview</h3>
            <div className="flex items-center gap-2">
                {isEditingBudget ? (
                    <button onClick={handleSaveBudget} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                        <SaveIcon className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={() => setIsEditingBudget(true)} className="text-gray-400 hover:text-primary-500">
                        <EditIcon className="w-4 h-4" />
                    </button>
                )}
                 <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="text-gray-400 hover:text-primary-500">
                    {isBalanceVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
            </div>
        </div>
        <div className="flex items-center justify-around mt-2">
            {/* Total Budget Section */}
            <div className="text-center">
                <p className="text-xs text-gray-400">Total Budget</p>
                {isEditingBudget ? (
                    <input 
                        type="number"
                        value={editedBudget}
                        onChange={(e) => setEditedBudget(e.target.value)}
                        className="text-2xl font-semibold text-gray-900 dark:text-gray-100 bg-transparent w-full focus:outline-none text-center"
                        autoFocus
                        onBlur={handleSaveBudget}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                    />
                ) : (
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {isBalanceVisible ? `₹${monthlyBudget.toFixed(2)}` : '₹******'}
                    </p>
                )}
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Remaining Budget Section */}
            <div className="text-center">
                <p className="text-xs text-gray-400">Remaining</p>
                <p className={`text-2xl font-semibold ${getStatusColor()}`}>
                    {isBalanceVisible ? `₹${remainingBudget.toFixed(2)}` : '₹******'}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;