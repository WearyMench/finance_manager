import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Palette,
  X,
  TrendingUp,
  TrendingDown,
  Save,
  Settings as SettingsIcon,
  User,
  Bell,
  Database,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import IconRenderer from './IconRenderer';

// Types
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color?: string;
}

export default function Settings() {
  const { state, dispatch } = useApp();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [activeTab, setActiveTab] = useState<'categories' | 'profile' | 'notifications' | 'data'>('categories');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState({
    name: state.userProfile.name,
    email: state.userProfile.email,
    currency: state.userProfile.currency,
  });
  const [notif, setNotif] = useState({
    budgetReminders: state.notificationSettings.budgetReminders,
    weeklySummary: state.notificationSettings.weeklySummary,
    savingGoals: state.notificationSettings.savingGoals,
  });

  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile as any });
  };

  const handleSaveNotifications = () => {
    dispatch({ type: 'UPDATE_NOTIFICATION_SETTINGS', payload: notif as any });
  };

  const escapeCSV = (value: any) => {
    const str = value === undefined || value === null ? '' : String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const downloadFile = (filename: string, content: string, mime = 'text/csv;charset=utf-8') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportTransactionsCSV = () => {
    const headers = ['id','type','amount','description','category','paymentMethod','date','createdAt'];
    const rows = state.transactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.description,
      t.category,
      t.paymentMethod,
      t.date,
      t.createdAt
    ].map(escapeCSV).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    downloadFile('transactions.csv', csv);
  };

  const exportBudgetsCSV = () => {
    const headers = ['id','category','amount','spent','period','startDate','endDate'];
    const rows = state.budgets.map(b => [
      b.id,
      b.category,
      b.amount,
      b.spent,
      b.period,
      b.startDate,
      b.endDate
    ].map(escapeCSV).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    downloadFile('budgets.csv', csv);
  };

  const handleExportClick = () => {
    exportTransactionsCSV();
    exportBudgetsCSV();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map(h => h.trim());
    const rows: string[][] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = [] as string[];
      let current = '';
      let inQuotes = false;
      const line = lines[i];
      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        if (inQuotes) {
          if (ch === '"') {
            if (c + 1 < line.length && line[c + 1] === '"') {
              current += '"';
              c++;
            } else {
              inQuotes = false;
            }
          } else {
            current += ch;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
          } else if (ch === ',') {
            row.push(current);
            current = '';
          } else {
            current += ch;
          }
        }
      }
      row.push(current);
      rows.push(row);
    }
    return { headers, rows };
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);
      // Expect our transactions headers
      const required = ['type','amount','description','category','paymentMethod','date'];
      const hasRequired = required.every(h => headers.includes(h));
      if (!hasRequired) {
        alert('El CSV no tiene las columnas requeridas para transacciones.');
        return;
      }
      const headerIndex: Record<string, number> = {};
      headers.forEach((h, idx) => headerIndex[h] = idx);
      const imported = rows.map(cols => {
        const id = cols[headerIndex['id']]?.trim() || Date.now().toString() + Math.random().toString(36).slice(2);
        const createdAt = cols[headerIndex['createdAt']]?.trim() || new Date().toISOString();
        return {
          id,
          type: (cols[headerIndex['type']] || 'expense').trim() as 'income' | 'expense',
          amount: Number(cols[headerIndex['amount']] || 0),
          description: (cols[headerIndex['description']] || '').trim(),
          category: (cols[headerIndex['category']] || '').trim(),
          paymentMethod: (cols[headerIndex['paymentMethod']] || 'cash').trim() as any,
          date: (cols[headerIndex['date']] || new Date().toISOString().split('T')[0]).trim(),
          createdAt,
        };
      }).filter(t => t.description && t.amount > 0 && t.category);

      // Merge by id (imported overwrites existing with same id)
      const mapById = new Map<string, any>();
      state.transactions.forEach(t => mapById.set(t.id, t));
      imported.forEach(t => mapById.set(t.id, t));
      const merged = Array.from(mapById.values());
      dispatch({ type: 'SET_TRANSACTIONS', payload: merged });
      alert(`Importadas ${imported.length} transacciones.`);
    } catch (err) {
      console.error(err);
      alert('Error al importar el archivo CSV.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
  };

  const handleSaveCategory = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: { ...categoryData, id: editingCategory.id } as any
      });
    } else {
      dispatch({
        type: 'ADD_CATEGORY',
        payload: { ...categoryData, id: Date.now().toString() } as any
      });
    }
    setShowCategoryForm(false);
    setEditingCategory(undefined);
  };

  const incomeCategories = state.categories.filter(cat => cat.type === 'income');
  const expenseCategories = state.categories.filter(cat => cat.type === 'expense');

  const tabs = [
    { id: 'categories', label: 'Categorías', icon: Tag, description: 'Gestionar categorías de ingresos y gastos' },
    { id: 'profile', label: 'Perfil', icon: User, description: 'Información personal y preferencias' },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, description: 'Configurar alertas y recordatorios' },
    { id: 'data', label: 'Datos', icon: Database, description: 'Importar/exportar y respaldos' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card animate-fade-in">
        <div className="card-header">
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
              <SettingsIcon size={24} />
            </div>
            <div>
              <h2 className="card-title">Configuración</h2>
              <p className="card-description">
                Personaliza tu experiencia con el gestor de gastos
              </p>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div 
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-6)'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--border-radius-lg)',
                  border: `2px solid ${isActive ? 'var(--color-primary-500)' : 'var(--color-neutral-300)'}`,
                  background: isActive ? 'rgba(124, 115, 242, 0.12)' : 'var(--gradient-surface)',
                  color: isActive ? 'var(--color-neutral-800)' : 'var(--color-neutral-800)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
                className="hover-lift"
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido por tabs */}
      {activeTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Categorías de Ingresos */}
          <div className="card animate-stagger-1">
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
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="card-title">Categorías de Ingresos</h3>
                      <p className="card-description">
                        {incomeCategories.length} categorías configuradas
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddCategory}
                  className="btn btn-success"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}
                >
                  <Plus size={16} />
                  Nueva Categoría
                </button>
              </div>
            </div>

            {incomeCategories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <TrendingUp size={32} />
                </div>
                <h3 className="empty-state-title">No hay categorías de ingresos</h3>
                <p className="empty-state-description">
                  Crea tu primera categoría de ingresos para organizar mejor tus finanzas
                </p>
              </div>
            ) : (
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-4)'
                }}
              >
                {incomeCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Categorías de Gastos */}
          <div className="card animate-stagger-2">
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
                        width: '40px',
                        height: '40px',
                        background: 'var(--gradient-error)',
                        borderRadius: 'var(--border-radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    >
                      <TrendingDown size={20} />
                    </div>
                    <div>
                      <h3 className="card-title">Categorías de Gastos</h3>
                      <p className="card-description">
                        {expenseCategories.length} categorías configuradas
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddCategory}
                  className="btn btn-error"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}
                >
                  <Plus size={16} />
                  Nueva Categoría
                </button>
              </div>
            </div>

            {expenseCategories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <TrendingDown size={32} />
                </div>
                <h3 className="empty-state-title">No hay categorías de gastos</h3>
                <p className="empty-state-description">
                  Crea tu primera categoría de gastos para controlar mejor tus finanzas
                </p>
              </div>
            ) : (
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-4)'
                }}
              >
                {expenseCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="card animate-stagger-1">
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
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--border-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <User size={20} />
              </div>
              <div>
                <h3 className="card-title">Perfil de Usuario</h3>
                <p className="card-description">Configura tu información personal</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="form-group">
              <label className="form-label">Nombre de usuario</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tu nombre"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Moneda preferida</label>
              <select className="form-select" value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value as any })}>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="MXN">Peso Mexicano (MXN)</option>
                <option value="COP">Peso Colombiano (COP)</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleSaveProfile}>
              <Save size={16} />
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card animate-stagger-1">
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
                <Bell size={20} />
              </div>
              <div>
                <h3 className="card-title">Notificaciones</h3>
                <p className="card-description">Configura tus alertas y recordatorios</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <NotificationSetting
              title="Recordatorios de presupuesto"
              description="Recibe alertas cuando te acerques al límite de tu presupuesto"
              defaultChecked={notif.budgetReminders}
              onChange={(v: boolean) => setNotif({ ...notif, budgetReminders: v })}
            />
            <NotificationSetting
              title="Resumen semanal"
              description="Recibe un resumen de tus gastos cada semana"
              defaultChecked={notif.weeklySummary}
              onChange={(v: boolean) => setNotif({ ...notif, weeklySummary: v })}
            />
            <NotificationSetting
              title="Metas de ahorro"
              description="Notificaciones sobre el progreso de tus metas de ahorro"
              defaultChecked={notif.savingGoals}
              onChange={(v: boolean) => setNotif({ ...notif, savingGoals: v })}
            />
            <div>
              <button className="btn btn-primary" onClick={handleSaveNotifications}>
                <Save size={16} />
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="card animate-stagger-1">
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
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--border-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <Database size={20} />
              </div>
              <div>
                <h3 className="card-title">Gestión de Datos</h3>
                <p className="card-description">Importar, exportar y respaldar tu información</p>
              </div>
            </div>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-4)'
            }}
          >
            <div 
              style={{
                padding: 'var(--space-5)',
                background: 'var(--gradient-surface)',
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--color-success-200)',
                textAlign: 'center'
              }}
            >
              <div 
                className="text-high-contrast"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--gradient-success)',
                  borderRadius: 'var(--border-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <Download size={20} />
              </div>
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                Exportar Datos
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700)', marginBottom: 'var(--space-4)' }}>
                Descarga tus transacciones y presupuestos en formato CSV
              </p>
              <button className="btn btn-success" onClick={handleExportClick}>
                <Download size={16} />
                Exportar
              </button>
            </div>

            <div 
              style={{
                padding: 'var(--space-5)',
                background: 'var(--gradient-surface)',
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--color-primary-200)',
                textAlign: 'center'
              }}
            >
              <div 
                className="text-high-contrast"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--border-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <Upload size={20} />
              </div>
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                Importar Datos
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700)', marginBottom: 'var(--space-4)' }}>
                Carga transacciones desde un archivo CSV
              </p>
              <button className="btn btn-primary" onClick={handleImportClick}>
                <Upload size={16} />
                Importar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario de categoría */}
      {showCategoryForm && (
        <div className="modal-overlay" onClick={() => setShowCategoryForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CategoryForm
              category={editingCategory}
              onClose={() => {
                setShowCategoryForm(false);
                setEditingCategory(undefined);
              }}
              onSave={handleSaveCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para tarjeta de categoría
interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div
      style={{
        background: 'var(--gradient-card)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-4)',
        border: `1px solid ${category.type === 'income' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="hover-lift"
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: category.type === 'income' ? 'var(--gradient-success)' : 'var(--gradient-error)'
        }}
      />

      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div 
            className="text-high-contrast"
            style={{
              width: '40px',
              height: '40px',
              background: category.type === 'income' ? 'var(--gradient-success)' : 'var(--gradient-error)',
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <IconRenderer iconName={category.icon} size={20} />
          </div>
          
          <div>
            <h4 
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--color-neutral-800)',
                margin: 0,
                marginBottom: 'var(--space-1)'
              }}
            >
              {category.name}
            </h4>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: category.type === 'income' ? 'var(--color-success-600)' : 'var(--color-error-600)'
              }}
            >
              {category.type === 'income' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {category.type === 'income' ? 'Ingreso' : 'Gasto'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          <button
            onClick={() => onEdit(category)}
            className="btn btn-ghost"
            style={{ padding: 'var(--space-2)', minWidth: 'auto' }}
            title="Editar categoría"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="btn btn-error"
            style={{ padding: 'var(--space-2)', minWidth: 'auto' }}
            title="Eliminar categoría"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para configuración de notificaciones
interface NotificationSettingProps {
  title: string;
  description: string;
  defaultChecked: boolean;
  onChange?: (value: boolean) => void;
}

function NotificationSetting({ title, description, defaultChecked, onChange }: NotificationSettingProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        background: 'var(--gradient-surface)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--color-neutral-200)'
      }}
    >
      <div style={{ flex: 1 }}>
        <h4 
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-neutral-800)',
            margin: 0,
            marginBottom: 'var(--space-1)'
          }}
        >
          {title}
        </h4>
        <p 
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-neutral-700)',
            margin: 0
          }}
        >
          {description}
        </p>
      </div>
      
      <label 
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '44px',
          height: '24px',
          cursor: 'pointer'
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            onChange?.(e.target.checked);
          }}
          style={{ display: 'none' }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: checked ? 'var(--gradient-primary)' : 'var(--color-neutral-300)',
            borderRadius: '12px',
            transition: 'all var(--transition-fast)'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            width: '20px',
            height: '20px',
            background: 'white',
            borderRadius: '50%',
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
      </label>
    </div>
  );
}

// Componente del formulario de categoría
interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
}

function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || 'expense',
    icon: category?.icon || 'Package',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const iconOptions = [
    'Package', 'Home', 'Car', 'Coffee', 'ShoppingBag', 'Utensils', 
    'Gamepad2', 'Book', 'Heart', 'Zap', 'Music', 'Camera',
    'Briefcase', 'DollarSign', 'CreditCard', 'Gift', 'Plane', 'Bus'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.icon) {
      newErrors.icon = 'El ícono es requerido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        name: formData.name.trim(),
        type: formData.type as 'income' | 'expense',
        icon: formData.icon,
      });
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <div className="modal-header">
        <h2 className="modal-title">
          {category ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>
      </div>

      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tipo de categoría</label>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)'
              }}
            >
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
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
                <TrendingUp size={16} style={{ marginRight: 'var(--space-2)' }} />
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
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
                <TrendingDown size={16} style={{ marginRight: 'var(--space-2)' }} />
                Gasto
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de la categoría *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Alimentación, Salario, etc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                borderColor: errors.name ? 'var(--color-error-500)' : undefined
              }}
            />
            {errors.name && (
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
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Palette size={16} style={{ marginRight: 'var(--space-2)' }} />
              Ícono *
            </label>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                gap: 'var(--space-2)',
                maxHeight: '200px',
                overflowY: 'auto',
                padding: 'var(--space-2)',
                border: '1px solid var(--color-neutral-300)',
                borderRadius: 'var(--border-radius-lg)'
              }}
            >
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--border-radius-lg)',
                    border: `2px solid ${formData.icon === icon ? 'var(--color-primary-500)' : 'var(--color-neutral-300)'}`,
                    background: formData.icon === icon ? 'var(--color-primary-50)' : 'white',
                    color: formData.icon === icon ? 'var(--color-primary-600)' : 'var(--color-neutral-700)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={icon}
                >
                  <IconRenderer iconName={icon} size={20} />
                </button>
              ))}
            </div>
            {errors.icon && (
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
                {errors.icon}
              </div>
            )}
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
          {category ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}