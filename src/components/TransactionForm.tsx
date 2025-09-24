import { useState, memo, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Tag, CreditCard, DollarSign, Save, AlertCircle } from 'lucide-react';

// Types
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  paymentMethod: 'cash' | 'transfer' | 'debit' | 'credit';
  date: string;
  createdAt: string;
}

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const TransactionForm = memo(function TransactionForm({ transaction, onClose, onSave }: TransactionFormProps) {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    category: transaction?.category || '',
    paymentMethod: transaction?.paymentMethod || 'cash',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData: Transaction = {
      id: transaction?.id || Date.now().toString(),
      type: formData.type as 'income' | 'expense',
      amount: Number(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      paymentMethod: formData.paymentMethod as 'cash' | 'transfer' | 'debit' | 'credit',
      date: formData.date,
      createdAt: transaction?.createdAt || new Date().toISOString()
    };

    onSave(transactionData);
  }, [formData, transaction, validateForm, onSave]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const availableCategories = useMemo(() => {
    return state.categories.filter(category => category.type === formData.type);
  }, [state.categories, formData.type]);

  const paymentMethods = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'debit', label: 'Tarjeta de Débito' },
    { value: 'credit', label: 'Tarjeta de Crédito' }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      {/* Header */}
      <div className="modal-header">
        <h2 className="modal-title">
          {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
        </h2>
        <button 
          onClick={onClose}
          className="modal-close"
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          {/* Tipo de transacción */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={16} style={{ marginRight: 'var(--space-2)' }} />
              Tipo de transacción
            </label>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)'
              }}
            >
              <button
                type="button"
                onClick={() => handleInputChange('type', 'income')}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--border-radius-lg)',
                  border: `2px solid ${formData.type === 'income' ? 'var(--color-success-500)' : 'var(--color-neutral-300)'}`,
                  background: formData.type === 'income' ? 'var(--color-success-50)' : 'white',
                  color: formData.type === 'income' ? 'var(--color-success-700)' : 'var(--color-neutral-700)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                ✅ Ingreso
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'expense')}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--border-radius-lg)',
                  border: `2px solid ${formData.type === 'expense' ? 'var(--color-error-500)' : 'var(--color-neutral-300)'}`,
                  background: formData.type === 'expense' ? 'var(--color-error-50)' : 'white',
                  color: formData.type === 'expense' ? 'var(--color-error-700)' : 'var(--color-neutral-700)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                ❌ Gasto
              </button>
            </div>
          </div>

          {/* Monto */}
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={16} style={{ marginRight: 'var(--space-2)' }} />
              Monto *
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              min="0"
              step="0.01"
              style={{
                borderColor: errors.amount ? 'var(--color-error-500)' : undefined
              }}
            />
            {errors.amount && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-1)',
                  color: 'var(--color-error-600)',
                  fontSize: '0.75rem'
                }}
              >
                <AlertCircle size={14} />
                {errors.amount}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label">Descripción *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Compra en supermercado"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                borderColor: errors.description ? 'var(--color-error-500)' : undefined
              }}
            />
            {errors.description && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-1)',
                  color: 'var(--color-error-600)',
                  fontSize: '0.75rem'
                }}
              >
                <AlertCircle size={14} />
                {errors.description}
              </div>
            )}
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={16} style={{ marginRight: 'var(--space-2)' }} />
              Categoría *
            </label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              style={{
                borderColor: errors.category ? 'var(--color-error-500)' : undefined
              }}
            >
              <option value="">Selecciona una categoría</option>
              {availableCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-1)',
                  color: 'var(--color-error-600)',
                  fontSize: '0.75rem'
                }}
              >
                <AlertCircle size={14} />
                {errors.category}
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div className="form-group">
            <label className="form-label">
              <CreditCard size={16} style={{ marginRight: 'var(--space-2)' }} />
              Método de pago
            </label>
            <select
              className="form-select"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} style={{ marginRight: 'var(--space-2)' }} />
              Fecha *
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              style={{
                borderColor: errors.date ? 'var(--color-error-500)' : undefined
              }}
            />
            {errors.date && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-1)',
                  color: 'var(--color-error-600)',
                  fontSize: '0.75rem'
                }}
              >
                <AlertCircle size={14} />
                {errors.date}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button 
          type="button"
          onClick={onClose}
          className="btn btn-ghost"
        >
          Cancelar
        </button>
        <button 
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
        >
          <Save size={16} />
          {transaction ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </div>
  );
});

export default TransactionForm;