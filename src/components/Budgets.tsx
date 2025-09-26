import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { 
  Plus, 
  Target, 
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  X,
  Save,
} from 'lucide-react';
import IconRenderer from './IconRenderer';

// Types
interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
}

export default function Budgets() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  const handleAddBudget = () => {
    setEditingBudget(undefined);
    setShowForm(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      try {
        const response = await apiService.deleteBudget(id);
        if (response.data || !response.error) {
          dispatch({ type: 'DELETE_BUDGET', payload: id });
        } else {
          console.error('Error deleting budget:', response.error);
          alert('Error al eliminar el presupuesto');
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Error al eliminar el presupuesto');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(undefined);
  };

  const handleSaveBudget = async (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    try {
      if (editingBudget) {
        // Update existing budget
        const response = await apiService.updateBudget(editingBudget.id, budgetData);
        if (response.data?.budget) {
          dispatch({
            type: 'UPDATE_BUDGET',
            payload: response.data.budget
          });
        }
      } else {
        // Create new budget
        const response = await apiService.createBudget(budgetData);
        if (response.data?.budget) {
          dispatch({
            type: 'ADD_BUDGET',
            payload: response.data.budget
          });
        }
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Error al guardar el presupuesto');
    }
  };

  // Calculate budget statistics
  const totalBudget = state.budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = state.budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const budgetsOnTrack = state.budgets.filter(budget => budget.spent <= budget.amount).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header con estadísticas generales */}
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
                    background: 'var(--gradient-warning)',
                    borderRadius: 'var(--border-radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="card-title">Presupuestos</h2>
                  <p className="card-description">
                    Controla tus gastos por categoría
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleAddBudget}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              <Plus size={20} />
              Nuevo Presupuesto
            </button>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)'
          }}
        >
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
              Presupuesto Total
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary-600)'
              }}
            >
              ${totalBudget.toLocaleString()}
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
              Total Gastado
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-error-600)'
              }}
            >
              ${totalSpent.toLocaleString()}
            </div>
          </div>

          <div 
            style={{
              background: 'var(--gradient-surface)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--border-radius-lg)',
              border: `1px solid ${totalRemaining >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: totalRemaining >= 0 ? 'var(--color-success-700)' : 'var(--color-error-700)',
                marginBottom: 'var(--space-2)'
              }}
            >
              Restante
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: totalRemaining >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)'
              }}
            >
              ${totalRemaining.toLocaleString()}
            </div>
          </div>

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
              En Control
            </div>
            <div 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-success-600)'
              }}
            >
              {budgetsOnTrack}/{state.budgets.length}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de presupuestos */}
      <div className="card animate-stagger-1">
        <div className="card-header">
          <h3 className="card-title">
            Mis Presupuestos ({state.budgets.length})
          </h3>
        </div>

        {state.budgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Target size={32} />
            </div>
            <h3 className="empty-state-title">No hay presupuestos</h3>
            <p className="empty-state-description">
              Comienza creando tu primer presupuesto para controlar tus gastos
            </p>
            <button 
              onClick={handleAddBudget}
              className="btn btn-primary"
              style={{ marginTop: 'var(--space-4)' }}
            >
              <Plus size={20} />
              Crear Primer Presupuesto
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {state.budgets.map((budget) => {
              const category = state.categories.find(c => c.id === budget.category);
              const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
              const isOverBudget = budget.spent > budget.amount;
              const remaining = budget.amount - budget.spent;
              
              return (
                <div
                  key={budget.id}
                  style={{
                    background: 'var(--gradient-card)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: 'var(--space-5)',
                    border: `1px solid ${isOverBudget ? 'rgba(239, 68, 68, 0.2)' : 'rgba(168, 85, 247, 0.1)'}`,
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="hover-lift"
                >
                  {/* Indicador de estado */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: isOverBudget ? 'var(--gradient-error)' : 
                                 percentage > 80 ? 'var(--gradient-warning)' : 
                                 'var(--gradient-success)'
                    }}
                  />

                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 'var(--space-4)',
                      marginBottom: 'var(--space-4)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div 
                        className="text-high-contrast"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: isOverBudget ? 'var(--gradient-error)' : 'var(--gradient-primary)',
                          borderRadius: 'var(--border-radius-lg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      >
                        <IconRenderer iconName={category?.icon || 'Package'} size={24} />
                      </div>
                      
                      <div>
                        <h4 
                          style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--color-neutral-800)',
                            margin: 0,
                            marginBottom: 'var(--space-1)'
                          }}
                        >
                          {category?.name || 'Categoría desconocida'}
                        </h4>
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: '0.875rem',
                            color: 'var(--color-neutral-700)'
                          }}
                        >
                          <Calendar size={14} />
                          Período: {budget.period === 'monthly' ? 'Mensual' : 
                                   budget.period === 'weekly' ? 'Semanal' : 'Anual'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="btn btn-ghost"
                        style={{ padding: 'var(--space-2)', minWidth: 'auto' }}
                        title="Editar presupuesto"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="btn btn-error"
                        style={{ padding: 'var(--space-2)', minWidth: 'auto' }}
                        title="Eliminar presupuesto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Progreso */}
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-2)'
                      }}
                    >
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-neutral-700)' }}>
                        Progreso: {percentage.toFixed(1)}%
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-neutral-700)' }}>
                        ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div 
                      style={{
                        width: '100%',
                        height: '8px',
                        background: 'var(--color-neutral-200)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          height: '100%',
                          background: isOverBudget ? 'var(--gradient-error)' : 
                                     percentage > 80 ? 'var(--gradient-warning)' : 
                                     'var(--gradient-success)',
                          borderRadius: '4px',
                          transition: 'width var(--transition-normal)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Estado y monto restante */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      {isOverBudget ? (
                        <>
                          <AlertCircle size={16} style={{ color: 'var(--color-error-500)' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-error-600)' }}>
                            Excedido por ${Math.abs(remaining).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} style={{ color: 'var(--color-success-500)' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-success-600)' }}>
                            Restante: ${remaining.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>

                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: percentage > 50 ? 'var(--color-error-600)' : 'var(--color-success-600)'
                      }}
                    >
                      {percentage > 50 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {percentage > 50 ? 'Alto gasto' : 'Bajo control'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <BudgetForm
              budget={editingBudget}
              categories={state.categories.filter(c => c.type === 'expense')}
              onClose={handleCloseForm}
              onSave={handleSaveBudget}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente del formulario de presupuesto
interface BudgetFormProps {
  budget?: Budget;
  categories: { id: string; name: string; type: string; icon: string }[];
  onClose: () => void;
  onSave: (budget: Omit<Budget, 'id' | 'spent'>) => void;
}

function BudgetForm({ budget, categories, onClose, onSave }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    amount: budget?.amount || '',
    period: budget?.period || 'monthly',
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.endDate || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-seleccionar primera categoría si no hay seleccionada
  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0]._id || categories[0].id }));
    }
  }, [formData.category, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        category: formData.category,
        amount: Number(formData.amount),
        period: formData.period as 'monthly' | 'weekly' | 'yearly',
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <div className="modal-header">
        <h2 className="modal-title">
          {budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
        </h2>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>
      </div>

      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Categoría *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ borderColor: errors.category ? 'var(--color-error-500)' : undefined }}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category._id || category.id} value={category._id || category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                {errors.category}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Monto del Presupuesto *</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0"
              step="0.01"
              style={{ borderColor: errors.amount ? 'var(--color-error-500)' : undefined }}
            />
            {errors.amount && (
              <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                {errors.amount}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Período</label>
            <select
              className="form-select"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'weekly' | 'yearly' })}
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Fecha de Inicio *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                style={{ borderColor: errors.startDate ? 'var(--color-error-500)' : undefined }}
              />
              {errors.startDate && (
                <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                  {errors.startDate}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Fin *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                style={{ borderColor: errors.endDate ? 'var(--color-error-500)' : undefined }}
              />
              {errors.endDate && (
                <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Cancelar
        </button>
        <button 
          type="button" 
          onClick={handleSubmit} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Save size={16} />
          {budget ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}