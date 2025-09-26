import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import apiService from '../services/api';

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

export type UserProfile = {
  name: string;
  email: string;
  currency: 'USD' | 'EUR' | 'MXN' | 'COP';
};

export type NotificationSettings = {
  budgetReminders: boolean;
  weeklySummary: boolean;
  savingGoals: boolean;
};

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  isLoading: boolean;
  userProfile: UserProfile;
  notificationSettings: NotificationSettings;
  isAuthenticated: boolean;
  user: any | null;
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
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'UPDATE_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_NOTIFICATION_SETTINGS'; payload: NotificationSettings }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: any | null }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  transactions: [],
  categories: [],
  budgets: [],
  isLoading: false,
  userProfile: {
    name: 'Usuario',
    email: '',
    currency: 'USD',
  },
  notificationSettings: {
    budgetReminders: true,
    weeklySummary: false,
    savingGoals: true,
  },
  isAuthenticated: false,
  user: null,
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
    
    case 'UPDATE_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    
    case 'UPDATE_NOTIFICATION_SETTINGS':
      return { ...state, notificationSettings: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        transactions: [],
        categories: [],
        budgets: [],
        userProfile: {
          name: 'Usuario',
          email: '',
          currency: 'USD',
        },
        notificationSettings: {
          budgetReminders: true,
          weeklySummary: false,
          savingGoals: true,
        },
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
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loadUserData: () => Promise<void>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check authentication and load user data on mount
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Check if user is authenticated
        if (apiService.isAuthenticated()) {
          const response = await apiService.getCurrentUser();
          if (response.data?.user) {
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            dispatch({ type: 'SET_USER', payload: response.data.user });
            await loadUserData();
          } else {
            // Token is invalid, clear it
            apiService.clearToken();
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        apiService.clearToken();
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  // Load user data from backend
  const loadUserData = useCallback(async () => {
    try {
      const [transactionsRes, categoriesRes, budgetsRes] = await Promise.all([
        apiService.getTransactions({ limit: 1000 }),
        apiService.getCategories(),
        apiService.getBudgets({ limit: 1000 })
      ]);

      if (transactionsRes.data?.transactions) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsRes.data.transactions });
      }

      if (categoriesRes.data?.categories) {
        dispatch({ type: 'SET_CATEGORIES', payload: categoriesRes.data.categories });
      }

      if (budgetsRes.data?.budgets) {
        dispatch({ type: 'SET_BUDGETS', payload: budgetsRes.data.budgets });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Recalculate budget spent based on transactions within budget date range
  useEffect(() => {
    if (state.isLoading) return;

    const computeBudgetSpent = (budget: Budget): number => {
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);

      return state.transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .filter(t => {
          const d = new Date(t.date);
          return d >= start && d <= end;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    };

    const updatedBudgets = state.budgets.map(budget => {
      const newSpent = computeBudgetSpent(budget);
      return newSpent !== budget.spent ? { ...budget, spent: newSpent } : budget;
    });

    const changed = updatedBudgets.some((b, i) => b.spent !== state.budgets[i]?.spent);
    if (changed) {
      dispatch({ type: 'SET_BUDGETS', payload: updatedBudgets });
    }
  }, [state.transactions, state.budgets, state.isLoading]);

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

  // Authentication functions
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      if (response.data?.user) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        dispatch({ type: 'SET_USER', payload: response.data.user });
        await loadUserData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [loadUserData]);

  const register = useCallback(async (userData: any): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      if (response.data?.user) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        dispatch({ type: 'SET_USER', payload: response.data.user });
        await loadUserData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }, [loadUserData]);

  const logout = useCallback(() => {
    apiService.clearToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    getDashboardStats,
    getTransactionsByMonth,
    getTransactionsByCategory,
    getTotalByCategory,
    login,
    register,
    logout,
    loadUserData,
  }), [state, dispatch, getDashboardStats, getTransactionsByMonth, getTransactionsByCategory, getTotalByCategory, login, register, logout, loadUserData]);

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
