import { useMemo } from 'react';
import type { Transaction } from '../context/AppContext';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export function useChartData(
  transactions: Transaction[],
  categories: Array<{ _id: string; name: string; color: string; type: string }>,
  type: 'expense' | 'income' = 'expense'
): ChartData {
  return useMemo(() => {
    const filteredCategories = categories.filter(cat => cat.type === type);
    
    const categoryData = filteredCategories.map(cat => ({
      name: cat.name,
      amount: transactions
        .filter(t => t.category._id === cat._id && t.type === type)
        .reduce((sum, t) => sum + t.amount, 0),
      color: cat.color,
    })).filter(cat => cat.amount > 0);

    return {
      labels: categoryData.map(cat => cat.name),
      datasets: [
        {
          label: type === 'expense' ? 'Gastos' : 'Ingresos',
          data: categoryData.map(cat => cat.amount),
          backgroundColor: categoryData.map(cat => cat.color),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [transactions, categories, type]);
}

export function useMonthlyChartData(
  getTransactionsByMonth: (year: number, month: number) => Transaction[],
  currentYear: number
): ChartData {
  return useMemo(() => {
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      labels: monthLabels,
      datasets: [
        {
          label: 'Ingresos',
          data: Array.from({ length: 12 }, (_, i) => {
            const monthTransactions = getTransactionsByMonth(currentYear, i);
            return monthTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
          }),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        },
        {
          label: 'Gastos',
          data: Array.from({ length: 12 }, (_, i) => {
            const monthTransactions = getTransactionsByMonth(currentYear, i);
            return monthTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
          }),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [getTransactionsByMonth, currentYear]);
}
