import React, { useState } from 'react';
import { analyzeExpensesWithAI } from '../services/geminiService';
import { Expense, Budget, UserCategory } from '../types';
import { SparklesIcon } from './icons';
import ConfirmationToast from './ConfirmationToast';

interface AiAnalyzerProps {
  expenses: Expense[];
  budgets: Budget[];
  categories: UserCategory[];
}

const AiAnalyzer: React.FC<AiAnalyzerProps> = ({ expenses, budgets, categories }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis('');
    try {
      const result = await analyzeExpensesWithAI(expenses, budgets, categories);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestAnalysis = () => {
    setShowConfirmation(true);
  };

  const onConfirmAnalysis = () => {
    setShowConfirmation(false);
    handleAnalyze();
  };

  const onCancelAnalysis = () => {
    setShowConfirmation(false);
  };
  
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    let html = '';
    let inList = false;

    for (const line of lines) {
        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');

        if (processedLine.startsWith('## ')) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<h2 class="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200">${processedLine.substring(3)}</h2>`;
        } else if (processedLine.startsWith('### ')) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<h3 class="text-lg font-semibold mt-3 mb-1 text-gray-700 dark:text-gray-300">${processedLine.substring(4)}</h3>`;
        } else if (processedLine.startsWith('* ')) {
            if (!inList) {
                html += '<ul class="space-y-1">';
                inList = true;
            }
            html += `<li class="ml-5 list-disc">${processedLine.substring(2)}</li>`;
        } else {
             if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p>${processedLine}</p>`;
        }
    }

    if (inList) {
        html += '</ul>';
    }

    return html;
};


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">AI Financial Advisor</h2>
        <button
          onClick={requestAnalysis}
          disabled={isLoading || expenses.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Get Insights
            </>
          )}
        </button>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      
      {analysis && (
         <div 
          className="prose prose-sm dark:prose-invert mt-4 max-w-none text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(analysis) }}
        />
      )}

      {!analysis && !isLoading && (
        <div className="mt-4 text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No analysis yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click "Get Insights" to analyze your spending.</p>
        </div>
      )}

      <ConfirmationToast
        isVisible={showConfirmation}
        message="This will send your expense data to be analyzed by the AI. Do you want to continue?"
        onConfirm={onConfirmAnalysis}
        onCancel={onCancelAnalysis}
        confirmText="Analyze"
      />
    </div>
  );
};

export default AiAnalyzer;
