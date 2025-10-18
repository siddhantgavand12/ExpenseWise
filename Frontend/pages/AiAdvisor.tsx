
import React from 'react';
import { Expense, Budget, UserCategory } from '../types';
import AiAnalyzer from '../components/AiAnalyzer';

interface AiAdvisorProps {
  expenses: Expense[];
  budgets: Budget[];
  categories: UserCategory[];
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ expenses, budgets, categories }) => {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">AI Financial Advisor</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
            Get personalized insights and recommendations on your spending habits from our AI-powered advisor. 
            Just click the "Get Insights" button to start.
        </p>
        <AiAnalyzer expenses={expenses} budgets={budgets} categories={categories} />
    </div>
  );
};

export default AiAdvisor;
