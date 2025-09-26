import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  DollarSign,
  Sun,
  Moon
} from 'lucide-react';
import AuthModal from './AuthModal';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoVariation, setLogoVariation] = useState(0);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const openLogin = () => {
    setIsLogin(true);
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setIsLogin(false);
    setShowAuthModal(true);
  };

  // Theme toggle functionality
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Apply theme to document
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Logo variations
  const logoVariations = [
    { title: "Gestor de Gastos", subtitle: "Control Financiero Inteligente" },
    { title: "Finanzas Pro", subtitle: "Tu Asesor Financiero Personal" },
    { title: "Money Master", subtitle: "Domina tus Finanzas" },
    { title: "Cash Flow", subtitle: "Optimiza tu Dinero" },
    { title: "Budget Boss", subtitle: "Líder en Gestión Financiera" }
  ];

  // Rotate logo variations
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoVariation((prev) => (prev + 1) % logoVariations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setIsDarkMode(theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const features = [
    {
      icon: <TrendingUp style={{ width: '32px', height: '32px' }} />,
      title: "Control Total",
      description: "Gestiona tus ingresos y gastos con precisión absoluta"
    },
    {
      icon: <BarChart3 style={{ width: '32px', height: '32px' }} />,
      title: "Análisis Inteligente",
      description: "Visualiza tu progreso financiero con gráficos detallados"
    },
    {
      icon: <Shield style={{ width: '32px', height: '32px' }} />,
      title: "100% Seguro",
      description: "Tus datos están protegidos con encriptación de nivel bancario"
    },
    {
      icon: <Smartphone style={{ width: '32px', height: '32px' }} />,
      title: "Multiplataforma",
      description: "Accede desde cualquier dispositivo, en cualquier momento"
    },
    {
      icon: <Zap style={{ width: '32px', height: '32px' }} />,
      title: "Rápido y Fácil",
      description: "Interfaz intuitiva que te permite gestionar en segundos"
    },
    {
      icon: <CheckCircle style={{ width: '32px', height: '32px' }} />,
      title: "Categorización Automática",
      description: "Organiza automáticamente tus transacciones por categorías"
    }
  ];

  const stats = [
    { number: "10K+", label: "Usuarios Activos" },
    { number: "50K+", label: "Transacciones Diarias" },
    { number: "99.9%", label: "Tiempo de Actividad" },
    { number: "4.9/5", label: "Calificación" }
  ];

  return (
    <div className="landing-page" style={{
      minHeight: '100vh',
      background: 'var(--gradient-background)',
      color: 'var(--color-neutral-900)'
    }}>
      {/* Header */}
      <header style={{
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Theme Toggle Button */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 10
        }}>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            {isDarkMode ? (
              <Sun style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
            ) : (
              <Moon style={{ width: '20px', height: '20px', color: '#6366f1' }} />
            )}
          </button>
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
        }}></div>
        <div style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'var(--color-white)',
                padding: '20px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.5s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div className="logo-icon" style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #10b981 100%)',
                    padding: '16px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)',
                    animation: 'float 3s ease-in-out infinite'
                  }}>
                    <DollarSign style={{ width: '36px', height: '36px', color: 'white' }} />
                  </div>
                  <div>
                    <h1 style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#0ea5e9',
                      margin: 0,
                      transition: 'all 0.5s ease'
                    }}>
                      {logoVariations[logoVariation].title}
                    </h1>
                    <p style={{
                      fontSize: '16px',
                      color: 'var(--color-neutral-600)',
                      margin: 0,
                      fontWeight: '500',
                      transition: 'all 0.5s ease'
                    }}>
                      {logoVariations[logoVariation].subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 style={{
              fontSize: 'clamp(36px, 8vw, 64px)',
              fontWeight: '800',
              color: 'var(--color-neutral-900)',
              marginBottom: '32px',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}>
              Toma el control de tu{' '}
              <span className="gradient-text" style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                dinero
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #10b981 100%)',
                  borderRadius: '2px',
                  opacity: '0.6'
                }}></span>
              </span>
            </h2>
            
            <p style={{
              fontSize: 'clamp(18px, 4vw, 22px)',
              color: 'var(--color-neutral-700)',
              marginBottom: '40px',
              maxWidth: '768px',
              margin: '0 auto 40px auto',
              lineHeight: '1.7',
              fontWeight: '400'
            }}>
              La plataforma más completa para gestionar tus finanzas personales. 
              <br />
              <strong style={{ color: 'var(--color-neutral-800)', fontWeight: '600' }}>
                Analiza, planifica y optimiza tus gastos con herramientas profesionales.
              </strong>
            </p>
            
            {/* Trust indicators */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '24px',
              marginBottom: '48px',
              opacity: '0.8'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--color-neutral-700)',
                fontWeight: '500'
              }}>
                <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />
                <span>100% Gratuito</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--color-neutral-700)',
                fontWeight: '500'
              }}>
                <Shield style={{ width: '16px', height: '16px', color: '#10b981' }} />
                <span>Datos Seguros</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--color-neutral-700)',
                fontWeight: '500'
              }}>
                <Zap style={{ width: '16px', height: '16px', color: '#10b981' }} />
                <span>Configuración Rápida</span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '64px',
              alignItems: 'center'
            }}>
              <button
                onClick={openRegister}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #10b981 100%)',
                  color: 'white',
                  padding: '18px 40px',
                  borderRadius: '16px',
                  fontWeight: '700',
                  fontSize: '18px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.3), 0 10px 10px -5px rgba(14, 165, 233, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(14, 165, 233, 0.4), 0 20px 25px -5px rgba(14, 165, 233, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(14, 165, 233, 0.3), 0 10px 10px -5px rgba(14, 165, 233, 0.1)';
                }}
              >
                <span>Comenzar Gratis</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
              
              <button
                onClick={openLogin}
                style={{
                  background: 'var(--color-white)',
                  color: 'var(--color-neutral-900)',
                  padding: '18px 40px',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '18px',
                  border: '2px solid var(--color-neutral-200)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(14, 165, 233, 0.2), 0 10px 10px -5px rgba(14, 165, 233, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                  e.currentTarget.style.background = 'var(--color-white)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                Iniciar Sesión
              </button>
              
              <p style={{
                fontSize: '14px',
                color: 'var(--color-neutral-600)',
                margin: '0',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Sin tarjeta de crédito requerida • Configuración en menos de 2 minutos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="landing-stats" style={{
        padding: '80px 0',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div style={{
                  fontSize: 'clamp(28px, 6vw, 40px)',
                  fontWeight: '800',
                  color: '#0ea5e9',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  color: 'var(--color-neutral-600)',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '100px 0',
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248,250,252,0.5) 100%)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Características
            </div>
            <h3 style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: '800',
              color: 'var(--color-neutral-900)',
              marginBottom: '24px',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}>
              Todo lo que necesitas para tus finanzas
            </h3>
            <p style={{
              fontSize: 'clamp(18px, 4vw, 22px)',
              color: 'var(--color-neutral-600)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Herramientas profesionales diseñadas para simplificar tu gestión financiera
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="landing-feature-card"
                style={{
                  background: 'var(--color-white)',
                  padding: '40px 32px',
                  borderRadius: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(147, 51, 234, 0.25), 0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)'
                }}>
                  <div style={{ color: 'white' }}>
                    {feature.icon}
                  </div>
                </div>
                <h4 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--color-neutral-900)',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  {feature.title}
                </h4>
                <p style={{
                  color: 'var(--color-neutral-600)',
                  lineHeight: '1.7',
                  fontSize: '16px'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '120px 0',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #10b981 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          maxWidth: '896px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 16px',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          }}>
            ¿Listo para transformar tus finanzas?
          </h3>
          <p style={{
            fontSize: 'clamp(18px, 4vw, 22px)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '48px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 48px auto'
          }}>
            Únete a miles de usuarios que ya están tomando el control de su dinero
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <button
              onClick={openRegister}
              style={{
                background: 'white',
                color: '#0ea5e9',
                padding: '20px 48px',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '20px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span>Empezar Ahora</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0',
              textAlign: 'center'
            }}>
              ✨ Configuración gratuita • Sin compromisos • Resultados inmediatos
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '80px 0 40px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)'
              }}>
                <DollarSign style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#ffffff'
              }}>Gestor de Gastos</span>
            </div>
            <p style={{
              color: '#94a3b8',
              marginBottom: '32px',
              fontSize: '16px',
              maxWidth: '400px',
              margin: '0 auto 32px auto',
              lineHeight: '1.6'
            }}>
              La mejor herramienta para gestionar tus finanzas personales
            </p>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '40px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >© 2024 Gestor de Gastos</span>
              <span>•</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >Privacidad</span>
              <span>•</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >Términos</span>
              <span>•</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >Soporte</span>
            </div>
            
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#cbd5e1',
                margin: '0',
                lineHeight: '1.5'
              }}>
                🚀 <strong>¿Listo para empezar?</strong> Únete a miles de usuarios que ya están tomando el control de sus finanzas. 
                Configuración gratuita en menos de 2 minutos.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        isLogin={isLogin}
        onToggleMode={() => setIsLogin(!isLogin)}
      />
    </div>
  );
};

export default LandingPage;
