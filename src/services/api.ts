const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    currency?: string;
  }) {
    const response = await this.request<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        currency: string;
        notificationSettings: any;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        currency: string;
        notificationSettings: any;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request<{
      user: {
        id: string;
        name: string;
        email: string;
        currency: string;
        notificationSettings: any;
      };
    }>('/auth/me');
  }

  async refreshToken() {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // Transaction methods
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      transactions: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>(endpoint);
  }

  async getTransaction(id: string) {
    return this.request<{ transaction: any }>(`/transactions/${id}`);
  }

  async createTransaction(transactionData: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    paymentMethod: 'cash' | 'transfer' | 'debit' | 'credit';
    date: string;
  }) {
    return this.request<{ transaction: any }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id: string, transactionData: Partial<{
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    paymentMethod: 'cash' | 'transfer' | 'debit' | 'credit';
    date: string;
  }>) {
    return this.request<{ transaction: any }>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/transactions/stats/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      summary: {
        totalIncome: number;
        totalExpenses: number;
        netAmount: number;
        incomeCount: number;
        expenseCount: number;
        totalTransactions: number;
      };
      period: {
        startDate: string;
        endDate: string;
      };
    }>(endpoint);
  }

  // Category methods
  async getCategories() {
    return this.request<{ categories: any[] }>('/categories');
  }

  async getCategory(id: string) {
    return this.request<{ category: any }>(`/categories/${id}`);
  }

  async createCategory(categoryData: {
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
  }) {
    return this.request<{ category: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: Partial<{
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
  }>) {
    return this.request<{ category: any }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async resetDefaultCategories() {
    return this.request<{ categories: any[] }>('/categories/reset-defaults', {
      method: 'POST',
    });
  }

  // Budget methods
  async getBudgets(params?: {
    page?: number;
    limit?: number;
    period?: 'monthly' | 'weekly' | 'yearly';
    category?: string;
    status?: 'good' | 'warning' | 'exceeded';
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/budgets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      budgets: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>(endpoint);
  }

  async getBudget(id: string) {
    return this.request<{ budget: any }>(`/budgets/${id}`);
  }

  async createBudget(budgetData: {
    category: string;
    amount: number;
    period: 'monthly' | 'weekly' | 'yearly';
    startDate: string;
    endDate: string;
  }) {
    return this.request<{ budget: any }>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  async updateBudget(id: string, budgetData: Partial<{
    category: string;
    amount: number;
    period: 'monthly' | 'weekly' | 'yearly';
    startDate: string;
    endDate: string;
  }>) {
    return this.request<{ budget: any }>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  }

  async deleteBudget(id: string) {
    return this.request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  async getBudgetStats() {
    return this.request<{
      summary: {
        totalBudget: number;
        totalSpent: number;
        totalRemaining: number;
        budgetsOnTrack: number;
        budgetsExceeded: number;
        totalBudgets: number;
      };
      budgets: any[];
    }>('/budgets/stats/summary');
  }

  async updateBudgetSpent(id: string) {
    return this.request<{ budget: any }>(`/budgets/${id}/update-spent`, {
      method: 'POST',
    });
  }

  // User methods
  async getUserProfile() {
    return this.request<{
      user: {
        id: string;
        name: string;
        email: string;
        currency: string;
        notificationSettings: any;
      };
    }>('/user/profile');
  }

  async updateUserProfile(profileData: {
    name?: string;
    currency?: string;
  }) {
    return this.request<{
      user: {
        id: string;
        name: string;
        email: string;
        currency: string;
        notificationSettings: any;
      };
    }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateNotificationSettings(settings: {
    budgetReminders?: boolean;
    weeklySummary?: boolean;
    savingGoals?: boolean;
  }) {
    return this.request<{
      user: {
        id: string;
        name: string;
        email: string;
        currency: string;
        notificationSettings: any;
      };
    }>('/user/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async deleteAccount(password: string) {
    return this.request('/user/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  async getUserStats() {
    return this.request<{
      counts: {
        transactions: number;
        budgets: number;
        categories: number;
      };
      monthlyStats: {
        income: number;
        expenses: number;
        netAmount: number;
        incomeCount: number;
        expenseCount: number;
      };
    }>('/user/stats');
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;
