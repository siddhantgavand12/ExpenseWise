import React from 'react';
import { Expense, UserCategory } from '../types';
import Charts from '../components/Charts';

interface ChartsPageProps {
  expenses: Expense[];
  categories: UserCategory[];
  archivedSpend: number;
}

const ChartsPage: React.FC<ChartsPageProps> = ({ expenses, categories, archivedSpend }) => {
  return (
     <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Visual Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">Visualize your spending patterns with these charts.</p>
        
        <Charts expenses={expenses} categories={categories} />
    </div>
  );
};

export default ChartsPage;