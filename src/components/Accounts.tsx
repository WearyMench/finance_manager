import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import type { Account } from '../context/AppContext';
import { 
  Wallet, 
  CreditCard, 
  Building2, 
  PiggyBank, 
  TrendingUp, 
  ArrowRightLeft,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Accounts: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferFromAccount, setTransferFromAccount] = useState<Account | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAccounts();
      if (response.data && 'success' in response.data && response.data.success) {
        dispatch({ type: 'SET_ACCOUNTS', payload: response.data.data });
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
      return;
    }

    try {
      const response = await apiService.deleteAccount(accountId);
      if (response.data && 'success' in response.data && response.data.success) {
        dispatch({ type: 'DELETE_ACCOUNT', payload: accountId });
        showNotification('success', 'Cuenta eliminada exitosamente');
      } else {
        showNotification('error', (response.data && 'message' in response.data ? response.data.message : null) || 'Error al eliminar cuenta');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('error', 'Error al eliminar cuenta');
    }
  };

  const getAccountTypeDisplay = (type: string) => {
    const types = {
      cash: 'Efectivo',
      bank: 'Cuenta Bancaria',
      credit: 'Tarjeta de Crédito',
      savings: 'Cuenta de Ahorros',
      investment: 'Inversión',
    };
    return types[type as keyof typeof types] || type;
  };

  const getAccountTypeIcon = (type: string) => {
    const icons = {
      cash: Wallet,
      bank: Building2,
      credit: CreditCard,
      savings: PiggyBank,
      investment: TrendingUp,
    };
    const IconComponent = icons[type as keyof typeof icons] || Wallet;
    return <IconComponent size={32} style={{ color: 'var(--color-primary-600)' }} />;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title">Mis Cuentas</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Plus size={20} />
          Agregar Cuenta
        </button>
      </div>

      {state.accounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={48} />
          </div>
          <h3 className="empty-state-title">No tienes cuentas registradas</h3>
          <p className="empty-state-description">Comienza agregando tu primera cuenta para gestionar tus finanzas</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <Plus size={20} />
            Crear Primera Cuenta
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {state.accounts.map((account) => (
            <div
              key={account._id}
              className="card card-hover"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: 'var(--border-radius-lg)', 
                    background: 'var(--color-primary-50)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {getAccountTypeIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="card-title" style={{ margin: 0, fontSize: '1rem' }}>{account.name}</h3>
                    <p className="card-description" style={{ margin: 0, fontSize: '0.875rem' }}>{getAccountTypeDisplay(account.type)}</p>
                  </div>
                </div>
                {account.isDefault && (
                  <span style={{
                    background: 'var(--color-success-100)',
                    color: 'var(--color-success-800)',
                    fontSize: '0.75rem',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--border-radius-full)',
                    fontWeight: '600'
                  }}>
                    Principal
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-2)' }}>
                  {formatCurrency(account.balance, account.currency)}
                </div>
                {account.type === 'credit' && account.creditLimit && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-1)' }}>
                    Límite: {formatCurrency(account.creditLimit, account.currency)}
                  </div>
                )}
                {account.description && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>{account.description}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => {
                    setTransferFromAccount(account);
                    setShowTransferForm(true);
                  }}
                  className="btn btn-success"
                  style={{ flex: 1, fontSize: '0.875rem', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                >
                  <ArrowRightLeft size={16} />
                  Transferir
                </button>
                <button
                  onClick={() => setEditingAccount(account)}
                  className="btn btn-ghost"
                  style={{ flex: 1, fontSize: '0.875rem', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteAccount(account._id)}
                  className="btn btn-error"
                  style={{ fontSize: '0.875rem', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Account Modal */}
      {(showAddForm || editingAccount) && (
        <AccountForm
          account={editingAccount}
          onClose={() => {
            setShowAddForm(false);
            setEditingAccount(null);
          }}
          onSave={(account) => {
            if (editingAccount) {
              dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
            } else {
              dispatch({ type: 'ADD_ACCOUNT', payload: account });
            }
            setShowAddForm(false);
            setEditingAccount(null);
          }}
        />
      )}

      {/* Transfer Modal */}
      {showTransferForm && transferFromAccount && (
        <TransferForm
          fromAccount={transferFromAccount}
          accounts={state.accounts}
          onClose={() => {
            setShowTransferForm(false);
            setTransferFromAccount(null);
          }}
          onTransfer={() => {
            setShowTransferForm(false);
            setTransferFromAccount(null);
            loadAccounts(); // Reload to get updated balances
          }}
        />
      )}

      {/* Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: notification.type === 'success' ? 'var(--color-success-500)' : 
                       notification.type === 'error' ? 'var(--color-error-500)' : 'var(--color-primary-500)',
            color: 'white',
            padding: 'var(--space-4)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={20} /> : 
           notification.type === 'error' ? <AlertCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

// Account Form Component
interface AccountFormProps {
  account?: Account | null;
  onClose: () => void;
  onSave: (account: any) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'cash' as const,
    balance: account?.balance || 0,
    currency: account?.currency || 'USD',
    description: account?.description || '',
    creditLimit: account?.creditLimit || 0,
    bankName: account?.bankName || '',
    accountNumber: account?.accountNumber || '',
    isDefault: account?.isDefault || false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification('error', 'El nombre de la cuenta es requerido');
      return false;
    }
    if (formData.balance < 0) {
      showNotification('error', 'El saldo no puede ser negativo');
      return false;
    }
    if (formData.type === 'credit' && formData.creditLimit <= 0) {
      showNotification('error', 'El límite de crédito debe ser mayor a 0');
      return false;
    }
    if (formData.type === 'bank' && !formData.bankName.trim()) {
      showNotification('error', 'El nombre del banco es requerido para cuentas bancarias');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const accountData = {
        ...formData,
        balance: parseFloat(formData.balance.toString()),
        creditLimit: formData.type === 'credit' ? parseFloat(formData.creditLimit.toString()) : undefined,
      };

      let response;
      if (account) {
        response = await apiService.updateAccount(account._id, accountData);
      } else {
        response = await apiService.createAccount(accountData);
      }

      if (response.data?.success) {
        onSave(response.data.data);
        showNotification('success', account ? 'Cuenta actualizada exitosamente' : 'Cuenta creada exitosamente');
        setTimeout(() => onClose(), 1500);
      } else {
        showNotification('error', response.data?.message || 'Error al guardar cuenta');
      }
    } catch (error) {
      showNotification('error', 'Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {account ? 'Editar Cuenta' : 'Nueva Cuenta'}
          </h3>
        </div>
        <div className="modal-body">
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">
                Nombre de la cuenta
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Tipo de cuenta
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="form-select"
                required
              >
                <option value="cash">Efectivo</option>
                <option value="bank">Cuenta Bancaria</option>
                <option value="credit">Tarjeta de Crédito</option>
                <option value="savings">Cuenta de Ahorros</option>
                <option value="investment">Inversión</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Saldo inicial
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="form-select"
                required
              >
                <option value="USD">USD - Dólar Americano</option>
                <option value="EUR">EUR - Euro</option>
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="COP">COP - Peso Colombiano</option>
                <option value="DOP">DOP - Peso Dominicano</option>
              </select>
            </div>

            {formData.type === 'credit' && (
              <div className="form-group">
                <label className="form-label">
                  Límite de crédito
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                  className="form-input"
                  required
                />
              </div>
            )}

            {formData.type === 'bank' && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    Nombre del banco
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Número de cuenta
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                style={{ marginRight: 'var(--space-2)' }}
              />
              <label htmlFor="isDefault" className="form-label" style={{ margin: 0 }}>
                Marcar como cuenta principal
              </label>
            </div>

          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSubmit}
          >
            {isLoading ? 'Guardando...' : (account ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: notification.type === 'success' ? 'var(--color-success-500)' : 
                       notification.type === 'error' ? 'var(--color-error-500)' : 'var(--color-primary-500)',
            color: 'white',
            padding: 'var(--space-4)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={20} /> : 
           notification.type === 'error' ? <AlertCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

// Transfer Form Component
interface TransferFormProps {
  fromAccount: Account;
  accounts: Account[];
  onClose: () => void;
  onTransfer: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ fromAccount, accounts, onClose, onTransfer }) => {
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: 0,
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const availableAccounts = accounts.filter(account => account._id !== fromAccount._id);

  const validateTransferForm = () => {
    if (!formData.toAccount) {
      showNotification('error', 'Debes seleccionar una cuenta destino');
      return false;
    }
    if (formData.amount <= 0) {
      showNotification('error', 'El monto debe ser mayor a 0');
      return false;
    }
    if (formData.amount > fromAccount.balance) {
      showNotification('error', 'El monto excede el saldo disponible');
      return false;
    }
    if (!formData.description.trim()) {
      showNotification('error', 'La descripción es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTransferForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.transferMoney(fromAccount._id, {
        toAccount: formData.toAccount,
        amount: formData.amount,
        description: formData.description,
      });

      if (response.data?.success) {
        showNotification('success', 'Transferencia realizada exitosamente');
        setTimeout(() => {
          onTransfer();
          onClose();
        }, 1500);
      } else {
        showNotification('error', response.data?.message || 'Error al realizar transferencia');
      }
    } catch (error) {
      showNotification('error', 'Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Transferir Dinero</h3>
        </div>
        <div className="modal-body">
          <div style={{ 
            marginBottom: 'var(--space-4)', 
            padding: 'var(--space-3)', 
            background: 'var(--color-neutral-50)', 
            borderRadius: 'var(--border-radius-md)' 
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-1)' }}>Desde:</p>
            <p style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>{fromAccount.name}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
              Saldo disponible: {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: fromAccount.currency,
              }).format(fromAccount.balance)}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">
                Cuenta destino
              </label>
              <select
                value={formData.toAccount}
                onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Seleccionar cuenta</option>
                {availableAccounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Monto
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={fromAccount.balance}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input"
                placeholder="Ej: Transferencia para gastos del mes"
                required
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || formData.amount > fromAccount.balance}
            className="btn btn-success"
            style={{ flex: 1 }}
            onClick={handleSubmit}
          >
            {isLoading ? 'Transferiendo...' : 'Transferir'}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: notification.type === 'success' ? 'var(--color-success-500)' : 
                       notification.type === 'error' ? 'var(--color-error-500)' : 'var(--color-primary-500)',
            color: 'white',
            padding: 'var(--space-4)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1002,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={20} /> : 
           notification.type === 'error' ? <AlertCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default Accounts;
