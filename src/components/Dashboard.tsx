import { useMemo, memo } from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  CreditCard,
  Banknote,
  Smartphone,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useChartData, useMonthlyChartData } from '../hooks/useChartData';
import RecentTransactions from './RecentTransactions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = memo(function Dashboard() {
  const { state, getDashboardStats, getTransactionsByMonth } = useApp();
  
  // Memoize expensive calculations
  const stats = useMemo(() => getDashboardStats(), [getDashboardStats]);
  
  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyTransactions = useMemo(() => 
    getTransactionsByMonth(currentYear, currentMonth), 
    [getTransactionsByMonth, currentYear, currentMonth]
  );

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthlyTransactions = useMemo(() => 
    getTransactionsByMonth(prevYear, prevMonth), 
    [getTransactionsByMonth, prevYear, prevMonth]
  );

  const currentIncome = useMemo(() => monthlyTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [monthlyTransactions]);
  const currentExpenses = useMemo(() => monthlyTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [monthlyTransactions]);
  const prevIncome = useMemo(() => prevMonthlyTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [prevMonthlyTransactions]);
  const prevExpenses = useMemo(() => prevMonthlyTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [prevMonthlyTransactions]);
  const currentBalance = currentIncome - currentExpenses;
  const prevBalance = prevIncome - prevExpenses;

  const pctChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };
  const incomeChange = pctChange(currentIncome, prevIncome);
  const expenseChange = pctChange(currentExpenses, prevExpenses);
  const balanceChange = pctChange(currentBalance, prevBalance);

  // Use optimized chart data hooks
  const doughnutData = useChartData(monthlyTransactions, state.categories, 'expense');
  const barData = useMonthlyChartData(getTransactionsByMonth, currentYear);

  const paymentMethodData = useMemo(() => ({
    cash: monthlyTransactions.filter(t => t.paymentMethod === 'cash').length,
    transfer: monthlyTransactions.filter(t => t.paymentMethod === 'transfer').length,
    debit: monthlyTransactions.filter(t => t.paymentMethod === 'debit').length,
    credit: monthlyTransactions.filter(t => t.paymentMethod === 'credit').length,
  }), [monthlyTransactions]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1a202c',
        bodyColor: '#4a5568',
        borderColor: 'rgba(124, 115, 242, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          },
          callback: function(value: string | number) {
            return `$${Number(value).toLocaleString()}`;
          },
        },
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          }
        }
      }
    },
  }), []);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: 'Inter',
            size: 11,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1a202c',
        bodyColor: '#4a5568',
        borderColor: 'rgba(124, 115, 242, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    cutout: '60%',
  }), []);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return Banknote;
      case 'transfer': return Smartphone;
      case 'debit': return CreditCard;
      case 'credit': return CreditCard;
      default: return CreditCard;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'var(--gradient-success)';
      case 'transfer': return 'var(--gradient-primary)';
      case 'debit': return 'var(--gradient-warning)';
      case 'credit': return 'var(--gradient-error)';
      default: return 'var(--gradient-primary)';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'transfer': return 'Transferencia';
      case 'debit': return 'Débito';
      case 'credit': return 'Crédito';
      default: return method;
    }
  };

  const maxPaymentMethodCount = Math.max(...Object.values(paymentMethodData), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header con resumen */}
      <div className="card animate-fade-in dashboard-header">
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-6)'
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
                <Activity size={24} />
              </div>
              <div>
                <h2 
                  className="text-high-contrast"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: 0
                  }}
                >
                  Resumen Financiero
                </h2>
                <p 
                  className="text-medium-contrast"
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {format(now, 'MMMM yyyy', { locale: es })}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p 
              style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-2)'
              }}
            >
              Balance Total
            </p>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)'
              }}
            >
              <div 
                className={`trend-indicator ${stats.totalBalance >= 0 ? 'positive' : 'negative'}`}
              />
              <span 
                style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: stats.totalBalance >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)'
                }}
              >
                ${stats.totalBalance.toLocaleString()}
              </span>
            </div>
            <div 
              className={`stat-card-trend ${stats.totalBalance >= 0 ? 'positive' : 'negative'}`}
            >
              {stats.totalBalance >= 0 ? 'Balance positivo' : 'Balance negativo'}
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid animate-stagger-1 dashboard-stats">
        <div className="stat-card income">
          <div className="stat-card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card-label">Ingresos</div>
          <div className="stat-card-value">
            ${stats.monthlyIncome.toLocaleString()}
          </div>
          <div className={`stat-card-trend ${incomeChange >= 0 ? 'positive' : 'negative'}`}>
            <div className={`trend-indicator ${incomeChange >= 0 ? 'positive' : 'negative'}`} />
            {incomeChange >= 0 ? '+' : ''}{incomeChange}% vs mes anterior
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-card-icon">
            <TrendingDown size={24} />
          </div>
          <div className="stat-card-label">Gastos</div>
          <div className="stat-card-value">
            ${stats.monthlyExpenses.toLocaleString()}
          </div>
          <div className={`stat-card-trend ${expenseChange >= 0 ? 'negative' : 'positive'}`}>
            <div className={`trend-indicator ${expenseChange >= 0 ? 'negative' : 'positive'}`} />
            {expenseChange >= 0 ? '+' : ''}{expenseChange}% vs mes anterior
          </div>
        </div>

        <div className="stat-card balance">
          <div className="stat-card-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-label">Balance</div>
          <div 
            className="stat-card-value"
            style={{
              color: stats.monthlyBalance >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)'
            }}
          >
            ${stats.monthlyBalance.toLocaleString()}
          </div>
          <div className={`stat-card-trend ${balanceChange >= 0 ? 'positive' : 'negative'}`}>
            <div className={`trend-indicator ${balanceChange >= 0 ? 'positive' : 'negative'}`} />
            {balanceChange >= 0 ? `Mejoró ${balanceChange}%` : `Empeoró ${Math.abs(balanceChange)}%`}
          </div>
        </div>

        <div className="stat-card budget">
          <div className="stat-card-icon">
            <Target size={24} />
          </div>
          <div className="stat-card-label">Presupuesto</div>
          <div 
            className="stat-card-value"
            style={{
              color: stats.budgetStatus.remaining >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)'
            }}
          >
            ${stats.budgetStatus.remaining.toLocaleString()}
          </div>
          <div className={`stat-card-trend ${stats.budgetStatus.remaining >= 0 ? 'positive' : 'negative'}`}>
            <div className={`trend-indicator ${stats.budgetStatus.remaining >= 0 ? 'positive' : 'negative'}`} />
            {stats.budgetStatus.remaining >= 0 ? 'Dentro del presupuesto' : 'Excedido'}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'var(--space-8)'
        }}
        className="animate-stagger-2 dashboard-charts"
      >
        {/* Gráfico de tendencias mensuales */}
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <div className="chart-title-icon">
                <BarChart3 size={20} />
              </div>
              <div className="chart-title-text">
                <h3>Tendencia Anual</h3>
                <p>Evolución de ingresos y gastos</p>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'var(--color-success-500)' }} />
                Ingresos
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'var(--color-error-500)' }} />
                Gastos
              </div>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Gráfico de categorías */}
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <div className="chart-title-icon">
                <PieChart size={20} />
              </div>
              <div className="chart-title-text">
                <h3>Gastos por Categoría</h3>
                <p>Distribución del gasto mensual</p>
              </div>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            {doughnutData.labels.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <PieChart size={32} />
                </div>
                <h3 className="empty-state-title">No hay gastos este mes</h3>
                <p className="empty-state-description">
                  Agrega tu primera transacción para ver el análisis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métodos de pago y transacciones recientes */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 'var(--space-8)'
        }}
        className="animate-stagger-3 dashboard-lower"
      >
        {/* Métodos de pago */}
        <div className="card payment-methods-card">
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
                  background: 'var(--gradient-success)',
                  borderRadius: 'var(--border-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="card-title">Métodos de Pago</h3>
                <p className="card-description">Uso por tipo de pago</p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {Object.entries(paymentMethodData).map(([method, count]) => {
              const Icon = getPaymentMethodIcon(method);
              const percentage = (count / maxPaymentMethodCount) * 100;
              
              return (
                <div
                  key={method}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4)',
                    background: 'var(--gradient-surface)',
                    borderRadius: 'var(--border-radius-lg)',
                    border: '1px solid var(--color-neutral-200)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div 
                      className="text-high-contrast"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: getPaymentMethodColor(method),
                        borderRadius: 'var(--border-radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div 
                        style={{
                          fontWeight: '600',
                          color: 'var(--color-neutral-800)',
                          fontSize: '0.875rem'
                        }}
                      >
                        {getPaymentMethodLabel(method)}
                      </div>
                      <div 
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-neutral-700)'
                        }}
                      >
                        {count} transacciones
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div 
                      style={{
                        width: '80px',
                        height: '6px',
                        background: 'var(--color-neutral-200)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: getPaymentMethodColor(method),
                          borderRadius: '3px',
                          transition: 'width var(--transition-normal)'
                        }}
                      />
                    </div>
                    <span 
                      style={{
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        color: 'var(--color-neutral-800)',
                        minWidth: '24px',
                        textAlign: 'center'
                      }}
                    >
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transacciones recientes */}
        <div className="recent-transactions-card">
          <RecentTransactions 
            transactions={monthlyTransactions} 
            categories={state.categories} 
          />
        </div>
      </div>
    </div>
  );
});

export default Dashboard;