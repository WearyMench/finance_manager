import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

// Types
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  paymentMethod: 'cash' | 'transfer' | 'debit' | 'credit';
  date: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
};

export type DashboardStats = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  budgetStatus: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
  };
};

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string };

const initialState: AppState = {
  transactions: [],
  categories: [],
  budgets: [],
  isLoading: false,
};

const defaultCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Salario', type: 'income', color: '#10B981', icon: 'Briefcase' },
  { id: '2', name: 'Freelance', type: 'income', color: '#3B82F6', icon: 'Laptop' },
  { id: '3', name: 'Inversiones', type: 'income', color: '#8B5CF6', icon: 'TrendingUp' },
  { id: '4', name: 'Otros', type: 'income', color: '#6B7280', icon: 'Wallet' },
  
  // Expense categories
  { id: '5', name: 'Alimentación', type: 'expense', color: '#F59E0B', icon: 'ShoppingCart' },
  { id: '6', name: 'Transporte', type: 'expense', color: '#EF4444', icon: 'Car' },
  { id: '7', name: 'Vivienda', type: 'expense', color: '#8B5CF6', icon: 'Home' },
  { id: '8', name: 'Entretenimiento', type: 'expense', color: '#EC4899', icon: 'Film' },
  { id: '9', name: 'Salud', type: 'expense', color: '#10B981', icon: 'Heart' },
  { id: '10', name: 'Educación', type: 'expense', color: '#3B82F6', icon: 'BookOpen' },
  { id: '11', name: 'Ropa', type: 'expense', color: '#F97316', icon: 'Shirt' },
  { id: '12', name: 'Otros', type: 'expense', color: '#6B7280', icon: 'Package' },
];

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getDashboardStats: () => DashboardStats;
  getTransactionsByMonth: (year: number, month: number) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTotalByCategory: (categoryId: string, year?: number, month?: number) => number;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      try {
        const savedTransactions = localStorage.getItem('transactions');
        const savedCategories = localStorage.getItem('categories');
        const savedBudgets = localStorage.getItem('budgets');

        if (savedTransactions) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) });
        }

        if (savedCategories) {
          dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(savedCategories) });
        } else {
          dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
        }

        if (savedBudgets) {
          dispatch({ type: 'SET_BUDGETS', payload: JSON.parse(savedBudgets) });
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
      localStorage.setItem('categories', JSON.stringify(state.categories));
      localStorage.setItem('budgets', JSON.stringify(state.budgets));
    }
  }, [state.transactions, state.categories, state.budgets, state.isLoading]);

  const getDashboardStats = useCallback((): DashboardStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = state.transactions.reduce((sum, transaction) => {
      return transaction.type === 'income' 
        ? sum + transaction.amount 
        : sum - transaction.amount;
    }, 0);

    const monthlyBudgets = state.budgets.filter(budget => {
      const budgetDate = new Date(budget.startDate);
      return budgetDate.getMonth() === currentMonth && 
             budgetDate.getFullYear() === currentYear;
    });

    const totalBudget = monthlyBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = monthlyBudgets.reduce((sum, budget) => sum + budget.spent, 0);

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance: monthlyIncome - monthlyExpenses,
      budgetStatus: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
      },
    };
  }, [state.transactions, state.budgets]);

  const getTransactionsByMonth = useCallback((year: number, month: number): Transaction[] => {
    return state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() === month;
    });
  }, [state.transactions]);

  const getTransactionsByCategory = useCallback((categoryId: string): Transaction[] => {
    return state.transactions.filter(transaction => transaction.category === categoryId);
  }, [state.transactions]);

  const getTotalByCategory = useCallback((categoryId: string, year?: number, month?: number): number => {
    let transactions = getTransactionsByCategory(categoryId);
    
    if (year !== undefined && month !== undefined) {
      transactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === year && 
               transactionDate.getMonth() === month;
      });
    }

    return transactions.reduce((sum, transaction) => {
      return transaction.type === 'income' 
        ? sum + transaction.amount 
        : sum - transaction.amount;
    }, 0);
  }, [getTransactionsByCategory]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    getDashboardStats,
    getTransactionsByMonth,
    getTransactionsByCategory,
    getTotalByCategory,
  }), [state, dispatch, getDashboardStats, getTransactionsByMonth, getTransactionsByCategory, getTotalByCategory]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
