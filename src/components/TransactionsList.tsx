import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import apiService from '../services/api';

// Types
interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: Category;
  paymentMethod: 'cash' | 'transfer' | 'debit' | 'credit';
  date: string;
  createdAt: string;
}

interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  paymentMethod: 'cash' | 'transfer' | 'debit' | 'credit';
  date: string;
}
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  ChevronDown,
  ChevronUp,
  List,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import TransactionForm from './TransactionForm';
import IconRenderer from './IconRenderer';

interface TransactionsListProps {
  showFormOnMount?: boolean;
}

const TransactionsList = memo(function TransactionsList({ showFormOnMount = false }: TransactionsListProps) {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [showForm, setShowForm] = useState(showFormOnMount);

  // Check if we should show the form based on navigation state
  useEffect(() => {
    if (location.state?.showForm) {
      setShowForm(true);
    }
    if (location.state?.search) {
      setSearchTerm(location.state.search);
    }
  }, [location.state]);
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');

  const handleAddTransaction = useCallback(async (transaction: TransactionFormData) => {
    try {
      // Convert category name to ID if needed
      let categoryId = transaction.category;
      if (transaction.category && !transaction.category.match(/^[0-9a-fA-F]{24}$/)) {
        // It's a name, find the ID
        const category = state.categories.find(cat => cat.name === transaction.category);
        categoryId = category?._id || transaction.category;
      }

      const transactionData = {
        ...transaction,
        category: categoryId
      };

      if (editingTransaction) {
        // Update existing transaction
        const response = await apiService.updateTransaction(editingTransaction.id, transactionData);
        if (response.data?.transaction) {
          dispatch({
            type: 'UPDATE_TRANSACTION',
            payload: response.data.transaction
          });
          setShowForm(false);
          setEditingTransaction(undefined);
        } else {
          console.error('Error actualizando transacción:', response.error);
        }
      } else {
        // Create new transaction
        const response = await apiService.createTransaction(transactionData);
        if (response.data?.transaction) {
          dispatch({
            type: 'ADD_TRANSACTION',
            payload: response.data.transaction
          });
          setShowForm(false);
        } else {
          console.error('Error creando transacción:', response.error);
        }
      }
    } catch (error) {
      console.error('Error procesando transacción:', error);
    }
  }, [dispatch, editingTransaction, state.categories]);


  const handleDeleteTransaction = useCallback(async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        const response = await apiService.deleteTransaction(id);
        if (response.data || !response.error) {
          dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id
          });
        } else {
          console.error('Error eliminando transacción:', response.error);
        }
      } catch (error) {
        console.error('Error eliminando transacción:', error);
      }
    }
  }, [dispatch]);

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = state.transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm);
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category.name === filterCategory;
      const matchesPaymentMethod = filterPaymentMethod === 'all' || transaction.paymentMethod === filterPaymentMethod;
      
      return matchesSearch && matchesType && matchesCategory && matchesPaymentMethod;
    });

    filtered.sort((a, b) => {
      let aValue: Date | number | string, bValue: Date | number | string;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [state.transactions, searchTerm, sortBy, sortOrder, filterType, filterCategory, filterPaymentMethod]);

  const totalIncome = useMemo(() => {
    return filteredAndSortedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredAndSortedTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredAndSortedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredAndSortedTransactions]);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'transfer': return 'Transferencia';
      case 'debit': return 'Débito';
      case 'credit': return 'Crédito';
      default: return method;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header con estadísticas */}
      <div className="card animate-fade-in">
        <div className="card-header">
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}
          >
            <div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                <div 
                  className="text-high-contrast"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--border-radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <List size={24} />
                </div>
                <div>
                  <h2 className="card-title">Transacciones</h2>
                  <p className="card-description">
                    {filteredAndSortedTransactions.length} transacciones encontradas
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              <Plus size={20} />
              Nueva Transacción
            </button>
          </div>
        </div>

        {/* Resumen rápido */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}
        >
          <div 
            style={{
              background: 'var(--gradient-surface)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-success-700)',
                marginBottom: 'var(--space-2)'
              }}
            >
              Total Ingresos
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-success-600)'
              }}
            >
              ${totalIncome.toLocaleString()}
            </div>
          </div>

          <div 
            style={{
              background: 'var(--gradient-surface)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-error-700)',
                marginBottom: 'var(--space-2)'
              }}
            >
              Total Gastos
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-error-600)'
              }}
            >
              ${totalExpenses.toLocaleString()}
            </div>
          </div>

          <div 
            style={{
              background: 'var(--gradient-surface)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-primary-700)',
                marginBottom: 'var(--space-2)'
              }}
            >
              Balance
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: totalIncome - totalExpenses >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)'
              }}
            >
              ${(totalIncome - totalExpenses).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card animate-stagger-1">
        <div className="filters-grid">
          {/* Búsqueda */}
          <div className="form-group search" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Search size={16} style={{ marginRight: 'var(--space-2)' }} />
              Buscar
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por descripción o monto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por tipo */}
          <div className="form-group type" style={{ marginBottom: 0 }}>
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            >
              <option value="all">Todos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <div className="form-group category" style={{ marginBottom: 0 }}>
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas</option>
              {state.categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por método de pago */}
          <div className="form-group payment" style={{ marginBottom: 0 }}>
            <label className="form-label">Método de pago</label>
            <select
              className="form-select"
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="debit">Débito</option>
              <option value="credit">Crédito</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <div className="form-group order" style={{ marginBottom: 0 }}>
            <label className="form-label">Ordenar por</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'description')}
              >
                <option value="date">Fecha</option>
                <option value="amount">Monto</option>
                <option value="description">Descripción</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn btn-ghost"
                style={{ minWidth: 'auto', padding: 'var(--space-3)' }}
                title={sortOrder === 'asc' ? 'Cambiar a descendente' : 'Cambiar a ascendente'}
              >
                {sortOrder === 'asc' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="card animate-stagger-2">
        <div className="card-header">
          <h3 className="card-title">
            Historial de Transacciones ({filteredAndSortedTransactions.length})
          </h3>
        </div>

        {filteredAndSortedTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <List size={32} />
            </div>
            <h3 className="empty-state-title">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterPaymentMethod !== 'all' 
                ? 'No se encontraron transacciones' 
                : 'No hay transacciones'
              }
            </h3>
            <p className="empty-state-description">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterPaymentMethod !== 'all'
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Comienza agregando tu primera transacción'
              }
            </p>
            {(!searchTerm && filterType === 'all' && filterCategory === 'all' && filterPaymentMethod === 'all') && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
                style={{ marginTop: 'var(--space-4)' }}
              >
                <Plus size={20} />
                Agregar Primera Transacción
              </button>
            )}
          </div>
        ) : (
          <div className="transaction-list">
            {filteredAndSortedTransactions.map((transaction) => {
              const category = transaction.category;
              
              return (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-content">
                    <div 
                      className="transaction-icon"
                      style={{
                        background: transaction.type === 'income' 
                          ? 'var(--gradient-success)' 
                          : 'var(--gradient-error)'
                      }}
                    >
                      <IconRenderer 
                        iconName={category?.icon || 'Package'} 
                        size={20} 
                      />
                    </div>
                    
                    <div className="transaction-info">
                      <div className="transaction-description">
                        {transaction.description}
                      </div>
                      <div className="transaction-details">
                        <span className="transaction-category">
                          {category?.name || 'Sin categoría'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          <Calendar size={12} />
                          {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          <CreditCard size={12} />
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="transaction-amount">
                      <div 
                        className={`transaction-value ${transaction.type}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-1)'
                        }}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownLeft size={16} />
                        )}
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </div>
                      <div className="transaction-payment">
                        <div 
                          style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            alignItems: 'center'
                          }}
                        >
                          <button
                            onClick={() => setEditingTransaction(transaction)}
                            className="btn btn-ghost"
                            style={{ 
                              padding: 'var(--space-1)', 
                              minWidth: 'auto',
                              fontSize: '0.75rem'
                            }}
                            title="Editar transacción"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="btn btn-error"
                            style={{ 
                              padding: 'var(--space-1)', 
                              minWidth: 'auto',
                              fontSize: '0.75rem'
                            }}
                            title="Eliminar transacción"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {(showForm || editingTransaction) && (
        <div className="modal-overlay" onClick={() => {
          setShowForm(false);
          setEditingTransaction(undefined);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TransactionForm
              transaction={editingTransaction}
              onClose={() => {
                setShowForm(false);
                setEditingTransaction(undefined);
              }}
              onSave={handleAddTransaction}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default TransactionsList;