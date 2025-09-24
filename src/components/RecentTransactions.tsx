import { memo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { List, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import IconRenderer from './IconRenderer';
import type { Transaction, Category } from '../context/AppContext';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

const RecentTransactions = memo(function RecentTransactions({ 
  transactions, 
  categories 
}: RecentTransactionsProps) {
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
    <div className="card">
      <div className="card-header">
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
        >
          <div 
            className="text-high-contrast"
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--gradient-warning)',
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <List size={20} />
          </div>
          <div>
            <h3 className="card-title">Transacciones Recientes</h3>
            <p className="card-description">Últimos movimientos del mes</p>
          </div>
        </div>
        <div 
          style={{
            padding: 'var(--space-1) var(--space-3)',
            background: 'var(--color-warning-100)',
            color: 'var(--color-warning-700)',
            borderRadius: 'var(--border-radius-full)',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
        >
          {transactions.length} total
        </div>
      </div>
      
      <div className="transaction-list">
        {transactions.slice(0, 5).map((transaction) => {
          const category = categories.find(c => c.id === transaction.category);
          
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
                      <Clock size={12} />
                      {format(new Date(transaction.date), 'dd MMM', { locale: es })}
                    </span>
                    <span>{getPaymentMethodLabel(transaction.paymentMethod)}</span>
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
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {transactions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <List size={32} />
            </div>
            <h3 className="empty-state-title">No hay transacciones</h3>
            <p className="empty-state-description">
              Comienza agregando tu primera transacción para ver el historial aquí
            </p>
          </div>
        )}
        
        {transactions.length > 5 && (
          <div 
            style={{
              textAlign: 'center',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-neutral-200)'
            }}
          >
            <button 
              className="btn btn-ghost"
              style={{
                color: 'var(--color-primary-600)',
                fontSize: '0.875rem'
              }}
            >
              Ver todas las transacciones ({transactions.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default RecentTransactions;