import { memo } from 'react';
import { Wallet, TrendingUp, Target, Settings } from 'lucide-react';

const LoadingScreen = memo(function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--gradient-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'var(--z-modal)'
    }}>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)'
      }}>
        {/* Logo Animation */}
        <div style={{ position: 'relative', alignSelf: 'center' }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--border-radius-2xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-2xl)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <Wallet style={{ width: '48px', height: '48px', color: 'var(--color-neutral-800)' }} />
          </div>
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            background: 'var(--color-success-500)',
            borderRadius: '50%',
            border: '4px solid var(--color-neutral-800)',
            animation: 'bounce 1s ease-in-out infinite'
          }}></div>
        </div>

        {/* App Title */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: 'var(--color-neutral-800)',
            margin: 0,
            fontFamily: 'var(--font-primary)'
          }}>
            Gestor de Gastos
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-neutral-600)',
            fontWeight: '500',
            margin: 0
          }}>
            Cargando tu aplicación...
          </p>
        </div>

        {/* Loading Animation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2)'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: 'var(--color-primary-500)',
            borderRadius: '50%',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: '0ms'
          }}></div>
          <div style={{
            width: '12px',
            height: '12px',
            background: 'var(--color-primary-600)',
            borderRadius: '50%',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: '150ms'
          }}></div>
          <div style={{
            width: '12px',
            height: '12px',
            background: 'var(--color-primary-700)',
            borderRadius: '50%',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: '300ms'
          }}></div>
        </div>

        {/* Feature Icons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-8)',
          paddingTop: 'var(--space-8)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            opacity: 0.7
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--gradient-success)',
              borderRadius: 'var(--border-radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <TrendingUp style={{ width: '24px', height: '24px', color: 'var(--color-neutral-800)' }} />
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: 'var(--color-neutral-600)'
            }}>Dashboard</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            opacity: 0.7
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--gradient-warning)',
              borderRadius: 'var(--border-radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <Target style={{ width: '24px', height: '24px', color: 'var(--color-neutral-800)' }} />
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: 'var(--color-neutral-600)'
            }}>Presupuestos</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            opacity: 0.7
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--border-radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <Settings style={{ width: '24px', height: '24px', color: 'var(--color-neutral-800)' }} />
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: 'var(--color-neutral-600)'
            }}>Configuración</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '256px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '100%',
            background: 'var(--color-neutral-200)',
            borderRadius: 'var(--border-radius-full)',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--border-radius-full)',
              animation: 'progress-shine 2s ease-in-out infinite'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoadingScreen;
