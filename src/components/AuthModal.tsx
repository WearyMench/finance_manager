import { useState, memo, useCallback, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  isLogin?: boolean;
  onToggleMode?: () => void;
}

const AuthModal = memo(function AuthModal({ isOpen, onClose, onSuccess, isLogin: initialIsLogin = true, onToggleMode }: AuthModalProps) {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    currency: 'USD'
  });

  // Sync with prop changes
  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      } else if (formData.name.length < 2) {
        newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          currency: formData.currency
        });
      }

      if (success) {
        onSuccess({}); // User data is already set in context
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          currency: 'USD'
        });
      } else {
        setErrors({ general: 'Credenciales inválidas. Intenta de nuevo.' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Error inesperado. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  }, [formData, isLogin, validateForm, login, register, onSuccess, onClose]);

  const toggleMode = useCallback(() => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      currency: 'USD'
    });
    // Call external toggle function if provided
    if (onToggleMode) {
      onToggleMode();
    }
  }, [isLogin, onToggleMode]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button 
            onClick={onClose}
            className="modal-close"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--color-error-300)',
                  borderRadius: 'var(--border-radius-md)',
                  color: 'var(--color-error-600)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--space-4)'
                }}
              >
                <AlertCircle size={16} />
                {errors.general}
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <User size={16} style={{ marginRight: 'var(--space-2)' }} />
                  Nombre *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    borderColor: errors.name ? 'var(--color-error-500)' : undefined
                  }}
                />
                {errors.name && (
                  <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                    {errors.name}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: 'var(--space-2)' }} />
                Email *
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  borderColor: errors.email ? 'var(--color-error-500)' : undefined
                }}
              />
              {errors.email && (
                <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} style={{ marginRight: 'var(--space-2)' }} />
                Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={{
                    borderColor: errors.password ? 'var(--color-error-500)' : undefined,
                    paddingRight: 'var(--space-10)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-neutral-500)',
                    cursor: 'pointer',
                    padding: 'var(--space-1)'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <Lock size={16} style={{ marginRight: 'var(--space-2)' }} />
                    Confirmar Contraseña *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    style={{
                      borderColor: errors.confirmPassword ? 'var(--color-error-500)' : undefined
                    }}
                  />
                  {errors.confirmPassword && (
                    <div style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: 'var(--space-1)' }}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Moneda</label>
                  <select
                    className="form-select"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  >
                    <option value="USD">USD - Dólar Americano</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="DOP">DOP - Peso Dominicano</option>
                  </select>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="button"
            onClick={toggleMode}
            className="btn btn-ghost"
            disabled={loading}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            {loading ? (
              <>
                <div 
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                />
                {isLogin ? 'Iniciando...' : 'Creando...'}
              </>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default AuthModal;
