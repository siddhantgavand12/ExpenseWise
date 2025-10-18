import React, { useState } from 'react';
import { CalculatorIcon } from './icons';

interface BudgetAdjusterProps {
    monthlyBudget: number;
    setMonthlyBudget: (value: number) => void;
}

const BudgetAdjuster: React.FC<BudgetAdjusterProps> = ({ monthlyBudget, setMonthlyBudget }) => {
    const [amount, setAmount] = useState('');

    const handleAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        const adjustment = parseFloat(amount);
        if (isNaN(adjustment)) {
            return;
        }

        const newBudget = monthlyBudget + adjustment;
        // Prevent budget from going negative
        setMonthlyBudget(Math.max(0, newBudget));
        setAmount(''); // Reset input
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <CalculatorIcon className="w-6 h-6 text-primary-500" />
                Balance Calculator
            </h2>
            <form onSubmit={handleAdjust} className="space-y-4">
                <div>
                    <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount to Add/Subtract
                    </label>
                    <input
                        type="number"
                        id="adjustment"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g., 500 or -50"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter a positive value to add (e.g., salary) or a negative value to subtract.</p>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    Adjust Balance
                </button>
            </form>
        </div>
    );
};

export default BudgetAdjuster;