import React, { useState, useMemo } from 'react';
import { Expense, UserCategory } from '../types';
import { AllIcons, DownloadIcon } from '../components/icons';
import ConfirmationToast from '../components/ConfirmationToast';

interface ReportsProps {
  expenses: Expense[];
  categories: UserCategory[];
}

const Reports: React.FC<ReportsProps> = ({ expenses, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7)); // e.g., "2024-10"

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    if (monthFilter) {
      filtered = filtered.filter(e => e.date.startsWith(monthFilter));
    }

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }

    const [key, order] = sortBy.split('_');

    return [...filtered].sort((a, b) => {
      let valA, valB;
      switch (key) {
        case 'date':
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
          break;
        case 'amount':
          valA = a.amount;
          valB = b.amount;
          break;
        case 'category':
          valA = a.category;
          valB = b.category;
          break;
        default:
          return 0;
      }
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, searchTerm, categoryFilter, sortBy, monthFilter]);
  
  const totalAmount = filteredAndSortedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleExportCSV = () => {
      if (filteredAndSortedExpenses.length === 0) {
        alert("No data to export.");
        return;
      }

      const headers = ['Date', 'Category', 'Notes', 'Amount'];
      const rows = filteredAndSortedExpenses.map(expense => {
        // Escape commas and quotes in notes
        const notes = `"${expense.notes.replace(/"/g, '""')}"`;
        return [expense.date, expense.category, notes, expense.amount.toFixed(2)].join(',');
      });
      
      // Add a blank row for separation
      const blankRow = ',,,';
      // Add a total row
      const totalRow = ['', '', 'Total', totalAmount.toFixed(2)].join(',');

      const csvContent = [headers.join(','), ...rows, blankRow, totalRow].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `expense-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };
  
  const handleExportPDF = () => {
    if (filteredAndSortedExpenses.length === 0) {
        alert("No data to export.");
        return;
    }

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
        alert('Please allow popups to export the PDF.');
        return;
    }

    const reportDate = new Date().toLocaleDateString('en-IN');
    const month = monthFilter ? new Date(monthFilter + '-02').toLocaleString('en-IN', { month: 'long', year: 'numeric' }) : 'All Time';
    const category = categoryFilter === 'all' ? 'All Categories' : categoryFilter;
    const sanitizedTitle = `Expense Report - ${month}`;

    const tableRows = filteredAndSortedExpenses.map(expense => `
        <tr>
            <td>${new Date(`${expense.date}T00:00:00`).toLocaleDateString('en-IN')}</td>
            <td>${expense.category}</td>
            <td>${expense.notes || ''}</td>
            <td class="amount">₹${expense.amount.toFixed(2)}</td>
        </tr>
    `).join('');

    const htmlContent = `
        <html>
        <head>
            <title>${sanitizedTitle}</title>
            <style>
                body { font-family: sans-serif; margin: 2rem; color: #333; }
                h1 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 0.5rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
                th { background-color: #f7fafc; font-weight: 600; }
                .summary { border: 1px solid #e2e8f0; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; background-color: #f7fafc; }
                .summary p { margin: 0.5rem 0; font-size: 14px; }
                .summary strong { display: inline-block; width: 160px; color: #555; }
                .amount { text-align: right; }
                tfoot td { font-weight: bold; background-color: #f7fafc; }
                @media print {
                    body { margin: 1rem; }
                }
            </style>
        </head>
        <body>
            <h1>Expense Report</h1>
            <div class="summary">
                <p><strong>Report Date:</strong> ${reportDate}</p>
                <p><strong>Period:</strong> ${month}</p>
                <p><strong>Category Filter:</strong> ${category}</p>
                <p><strong>Total Transactions:</strong> ${filteredAndSortedExpenses.length}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Notes</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="amount"><strong>Total</strong></td>
                        <td class="amount"><strong>₹${totalAmount.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </body>
        </html>
    `;

    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    reportWindow.focus();
    
    // Timeout helps ensure content is loaded before print dialog opens
    setTimeout(() => {
        reportWindow.print();
        reportWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md no-print">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Expense Reports</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Review and filter your spending history.</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleExportPDF}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <DownloadIcon className="w-4 h-4 mr-2"/>
                    Export PDF
                </button>
                <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <DownloadIcon className="w-4 h-4 mr-2"/>
                    Export CSV
                </button>
            </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col max-h-[75vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 no-print flex-shrink-0">
          <input
            type="text"
            placeholder="Search in notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          />
          <input
            type="month"
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
            <option value="date_desc">Date (Newest First)</option>
            <option value="date_asc">Date (Oldest First)</option>
            <option value="amount_desc">Amount (High to Low)</option>
            <option value="amount_asc">Amount (Low to High)</option>
            <option value="category_asc">Category (A-Z)</option>
          </select>
        </div>

        <div className="overflow-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedExpenses.map(expense => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(`${expense.date}T00:00:00`).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      {AllIcons[categories.find(c => c.name === expense.category)?.icon || 'other']}
                      <span>{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 truncate max-w-sm">{expense.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">₹{expense.amount.toFixed(2)}</td>
                </tr>
              ))}
              {filteredAndSortedExpenses.length === 0 && (
                 <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No expenses match your filters.
                    </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-700 sticky bottom-0">
                <tr>
                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Total</td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-100">₹{totalAmount.toFixed(2)}</td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;