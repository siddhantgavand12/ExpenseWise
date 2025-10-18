import React from 'react';
import { Expense, UserCategory } from '../types';
import { AllIcons } from './icons';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ChartsProps {
  expenses: Expense[];
  categories: UserCategory[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1', '#d0ed57'
];

const Charts: React.FC<ChartsProps> = ({ expenses, categories }) => {
  // --- Data processing for Daily Trend ComposedChart ---
  const dailyTotals = expenses.reduce((acc, expense) => {
    const date = expense.date;
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyChartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({
        date,
        daily: total,
        name: new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  // --- Data processing for Category Breakdown ---
  const categoryData = categories.map(category => {
    const total = expenses
      .filter(e => e.category === category.name)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: category.name, value: total, icon: category.icon };
  }).filter(item => item.value > 0);

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Daily Spending Trend</h2>
            {dailyChartData.length > 1 ? (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <ComposedChart
                            data={dailyChartData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fill: 'currentColor', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                    borderColor: '#4b5563',
                                    borderRadius: '0.5rem'
                                }}
                                labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
                                itemStyle={{ color: '#d1d5db' }}
                                formatter={(value: number, name: string) => [`₹${value.toFixed(2)}`, name]}
                            />
                            <Legend wrapperStyle={{fontSize: "14px"}} />
                            <Bar dataKey="daily" name="Daily Total" fill="#8884d8" />
                            <Line type="monotone" dataKey="daily" name="Daily Trend" stroke="#82ca9d" strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    Record expenses for at least two different days to see the daily trend.
                </div>
            )}
        </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Expense Breakdown</h2>
        {totalExpenses > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                  <h3 className="font-semibold text-center mb-2 text-gray-700 dark:text-gray-300">By Category</h3>
                   <div className="flex flex-col gap-4">
                      {categoryData.sort((a,b) => b.value - a.value).map((item, index) => {
                           const percentage = (item.value / totalExpenses) * 100;
                           return (
                              <div key={item.name}>
                                  <div className="flex justify-between mb-1">
                                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <span style={{ color: COLORS[index % COLORS.length] }}>{AllIcons[item.icon]}</span>
                                        {item.name}
                                      </div>
                                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{item.value.toFixed(2)}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}></div>
                                  </div>
                              </div>
                           )
                      })}
                   </div>
              </div>
              <div>
                  <h3 className="font-semibold text-center mb-2 text-gray-700 dark:text-gray-300">Visual</h3>
                  <svg viewBox="0 0 200 200" className="w-full h-auto max-w-xs mx-auto">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="20" className="dark:stroke-gray-700" />
                      {(() => {
                          let accumulatedPercentage = 0;
                          return categoryData.map((item, index) => {
                              const percentage = (item.value / totalExpenses) * 100;
                              const angle = percentage * 3.6;
                              const startAngle = accumulatedPercentage * 3.6;
                              accumulatedPercentage += percentage;
                              const x1 = 100 + 90 * Math.cos(Math.PI * (startAngle - 90) / 180);
                              const y1 = 100 + 90 * Math.sin(Math.PI * (startAngle - 90) / 180);
                              const x2 = 100 + 90 * Math.cos(Math.PI * (startAngle + angle - 90) / 180);
                              const y2 = 100 + 90 * Math.sin(Math.PI * (startAngle + angle - 90) / 180);
                              const largeArcFlag = angle > 180 ? 1 : 0;
                              
                              return (
                                 <path 
                                  key={item.name}
                                  d={`M ${x1} ${y1} A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                                  fill="none"
                                  stroke={COLORS[index % COLORS.length]}
                                  strokeWidth="20"
                                 />
                              );
                          });
                      })()}
                  </svg>
              </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No expenses recorded to display charts.
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;