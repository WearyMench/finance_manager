import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  List, 
  BarChart3, 
  Settings, 
  Wallet,
  TrendingUp,
  Menu,
  X,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Moon,
  Sun
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { getDashboardStats } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = 0;
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Dashboard', 
      description: 'Resumen financiero',
      color: 'primary'
    },
    { 
      path: '/transactions', 
      icon: List, 
      label: 'Transacciones', 
      description: 'Historial de movimientos',
      color: 'success'
    },
    { 
      path: '/budgets', 
      icon: BarChart3, 
      label: 'Presupuestos', 
      description: 'Control de gastos',
      color: 'warning'
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Configuración', 
      description: 'Personalizar app',
      color: 'neutral'
    },
  ];

  // Hidratar tema desde localStorage o prefers-color-scheme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      const isDark = savedTheme === 'dark';
      setDarkMode(isDark);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      setDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case 'k':
            e.preventDefault();
            setSearchOpen(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sidebarCollapsed]);

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Gestor de Gastos';
  };

  const getCurrentPageDescription = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.description : 'Controla tus finanzas inteligentemente';
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Header del Sidebar */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Wallet size={24} />
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-brand-text">
                <h1>Gestor</h1>
                <p>de Gastos</p>
              </div>
            )}
          </Link>
          
          <div style={{ marginTop: 'var(--space-2)' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="btn btn-ghost"
              style={{ padding: 'var(--space-2)', minWidth: 'auto' }}
              title={sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="nav-item-content">
                  <Icon className="nav-item-icon" size={20} />
                  {!sidebarCollapsed && (
                    <div className="nav-item-text">
                      <div className="nav-item-label">{item.label}</div>
                      <div className="nav-item-description">{item.description}</div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        {!sidebarCollapsed && (
          <div style={{ marginTop: 'auto', padding: 'var(--space-4)' }}>
              <div 
                className="text-high-contrast"
                style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--border-radius-xl)',
                padding: 'var(--space-4)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-2)'
                }}
              >
                <span style={{ color: 'var(--color-neutral-800)' }}>
                  Balance Total
                </span>
                <TrendingUp size={16} style={{ color: 'var(--color-neutral-800)' }} />
              </div>
              <div style={{ color: 'var(--color-neutral-800)', fontSize: '1.5rem', fontWeight: '700' }}>
                ${getDashboardStats().totalBalance.toLocaleString()}
              </div>
              <div 
                style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  marginTop: 'var(--space-2)',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    width: '75%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    borderRadius: '2px'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Header Principal */}
        <header className="main-header">
          <div className="header-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              {/* Botón menú móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn btn-ghost"
                style={{ 
                  display: 'none',
                  padding: 'var(--space-2)',
                  minWidth: 'auto'
                }}
                title="Abrir menú"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            <div className="header-title" style={{ position: 'relative' }}>
                <h1>{getCurrentPageTitle()}</h1>
                <p>{getCurrentPageDescription()}</p>
              </div>
            </div>

            <div className="header-actions" style={{ position: 'relative' }}>
              {/* Buscador */}
              <div 
                style={{
                  position: 'relative',
                  display: 'none' // Oculto por ahora, se puede implementar después
                }}
              >
                <Search 
                  size={20} 
                  style={{
                    position: 'absolute',
                    left: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="text-high-contrast"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: 'var(--space-2) var(--space-3) var(--space-2) var(--space-10)',
                    fontSize: '0.875rem',
                    width: '200px'
                  }}
                />
              </div>

              {/* Modo oscuro */}
              <button
                className="btn btn-ghost"
                style={{ padding: 'var(--space-2)', minWidth: 'auto' }}
                title={darkMode ? 'Cambiar a claro' : 'Cambiar a oscuro'}
                onClick={() => {
                  const next = !darkMode;
                  setDarkMode(next);
                  const theme = next ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  localStorage.setItem('theme', theme);
                }}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notificaciones */}
              <button
                className="btn btn-ghost"
                style={{ 
                  padding: 'var(--space-2)', 
                  minWidth: 'auto',
                  position: 'relative'
                }}
                title="Notificaciones"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      background: 'var(--color-error-500)',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 2px rgba(0,0,0,0.2)'
                    }}
                  />
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    zIndex: 1100
                  }}
                >
                  <div className="card-header" style={{ marginBottom: 0 }}>
                    <h3 className="card-title" style={{ fontSize: '1rem' }}>Notificaciones</h3>
                  </div>
                  <div className="card-description">No hay nuevas notificaciones</div>
                </div>
              )}

              {/* Perfil de usuario */}
              <Link 
                to="/settings"
                className="btn btn-ghost"
                style={{ 
                  padding: 'var(--space-2)', 
                  minWidth: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
                title="Perfil"
              >
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--gradient-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-neutral-800)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <User size={16} />
              </div>
                <span style={{ display: 'none' }}>Usuario</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Cuerpo Principal */}
        <div className="main-body">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* Modal de búsqueda global */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Buscar</h2>
              <button onClick={() => setSearchOpen(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Buscar en transacciones</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: café, 1200, alquiler..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate('/transactions', { state: { search: globalSearch } });
                      setSearchOpen(false);
                      setGlobalSearch('');
                    }
                  }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setSearchOpen(false)}>Cancelar</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate('/transactions', { state: { search: globalSearch } });
                    setSearchOpen(false);
                    setGlobalSearch('');
                  }}
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para móvil */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 'var(--z-modal-backdrop)'
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Botón flotante para agregar */}
      <Link
        to="/transactions"
        state={{ showForm: true }}
        className="btn-fab"
        title="Agregar transacción"
      >
        <Plus size={24} />
      </Link>

      <style>{`
        @media (max-width: 768px) {
          .btn-ghost[title="Abrir menú"] {
            display: flex !important;
          }
          
          .header-title h1 {
            font-size: 1.25rem;
          }
          
          .header-actions > *:not(.btn-ghost[title="Abrir menú"]) {
            display: none;
          }
          
          .header-actions .btn-ghost[title="Perfil"] {
            display: flex !important;
          }
        }
        
        @media (max-width: 640px) {
          .header-actions .btn-ghost[title="Perfil"] span {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}