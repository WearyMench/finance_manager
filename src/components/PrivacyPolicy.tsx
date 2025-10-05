import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const lastUpdated = "15 de Diciembre, 2024";

  const sections = [
    {
      id: "introduction",
      title: "1. Introducción",
      icon: <FileText size={20} />,
      content: (
        <div>
          <p>
            En nuestro equipo, nos comprometemos a proteger tu privacidad y datos personales. 
            Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información 
            cuando utilizas nuestra aplicación de organización de finanzas.
          </p>
          <p>
            Al utilizar nuestros servicios, aceptas las prácticas descritas en esta política. Si no estás de acuerdo 
            con alguna parte de esta política, por favor no utilices nuestros servicios.
          </p>
        </div>
      )
    },
    {
      id: "data-collection",
      title: "2. Información que Recopilamos",
      icon: <Database size={20} />,
      content: (
        <div>
          <h4>2.1 Información Personal</h4>
          <ul>
            <li><strong>Datos de registro:</strong> Nombre de usuario, dirección de correo electrónico, contraseña encriptada</li>
            <li><strong>Información de perfil:</strong> Moneda preferida, configuración de notificaciones</li>
          </ul>
          
          <h4>2.2 Información Financiera</h4>
          <ul>
            <li><strong>Transacciones:</strong> Ingresos y gastos que registres manualmente, con descripción, monto, fecha y categoría</li>
            <li><strong>Presupuestos:</strong> Límites de gasto por categoría que establezcas</li>
            <li><strong>Categorías:</strong> Categorías personalizadas de ingresos y gastos que crees</li>
          </ul>
          
          <h4>2.3 Información Técnica</h4>
          <ul>
            <li><strong>Datos de uso básicos:</strong> Funciones de la aplicación que utilices</li>
            <li><strong>Información del dispositivo:</strong> Tipo de navegador y sistema operativo</li>
          </ul>
        </div>
      )
    },
    {
      id: "data-usage",
      title: "3. Cómo Utilizamos tu Información",
      icon: <Eye size={20} />,
      content: (
        <div>
          <h4>3.1 Propósitos Principales</h4>
          <ul>
            <li><strong>Proporcionar servicios:</strong> Permitirte registrar y organizar tus transacciones financieras</li>
            <li><strong>Generar reportes:</strong> Crear gráficos y estadísticas básicas de tus gastos e ingresos</li>
            <li><strong>Gestión de presupuestos:</strong> Ayudarte a controlar tus gastos por categoría</li>
            <li><strong>Seguridad:</strong> Proteger tu cuenta con autenticación básica</li>
          </ul>
          
          <h4>3.2 Funcionalidades de la Aplicación</h4>
          <ul>
            <li>Registro manual de transacciones de ingresos y gastos</li>
            <li>Creación y gestión de categorías personalizadas</li>
            <li>Establecimiento de presupuestos por categoría</li>
            <li>Visualización de datos en gráficos y tablas</li>
            <li>Exportación de datos en formato CSV</li>
          </ul>
          
          <h4>3.3 Comunicación</h4>
          <ul>
            <li>Responder a consultas de soporte técnico</li>
            <li>Notificar sobre actualizaciones importantes de la aplicación</li>
          </ul>
        </div>
      )
    },
    {
      id: "data-protection",
      title: "4. Protección de Datos",
      icon: <Shield size={20} />,
      content: (
        <div>
          <h4>4.1 Medidas de Seguridad Básicas</h4>
          <ul>
            <li><strong>Encriptación:</strong> Los datos se transmiten de forma segura (HTTPS)</li>
            <li><strong>Autenticación:</strong> Sistema de login con email y contraseña</li>
            <li><strong>Acceso restringido:</strong> Solo tú puedes acceder a tus datos con tu cuenta</li>
            <li><strong>Almacenamiento local:</strong> Los datos se almacenan en tu dispositivo y en nuestros servidores</li>
          </ul>
          
          <h4>4.2 Protección de Datos</h4>
          <ul>
            <li>Utilizamos servidores seguros para almacenar tu información</li>
            <li>Implementamos copias de seguridad regulares</li>
            <li>No compartimos tu información con terceros</li>
            <li>Puedes exportar y eliminar tus datos cuando quieras</li>
          </ul>
          
          <h4>4.3 Limitaciones</h4>
          <ul>
            <li>Esta es una aplicación de organización de finanzas personal</li>
            <li>No procesamos pagos ni conectamos con bancos</li>
            <li>No ofrecemos servicios financieros profesionales</li>
            <li>Los datos son solo para tu uso personal</li>
          </ul>
        </div>
      )
    },
    {
      id: "data-sharing",
      title: "5. Compartir Información",
      icon: <UserCheck size={20} />,
      content: (
        <div>
          <h4>5.1 Principio General</h4>
          <p>
            <strong>No vendemos, alquilamos ni compartimos tu información personal con terceros</strong> para fines comerciales.
          </p>
          
          <h4>5.2 Uso de tus Datos</h4>
          <ul>
            <li><strong>Uso personal:</strong> Tus datos solo se utilizan para proporcionarte el servicio de gestión financiera</li>
            <li><strong>Sin análisis externos:</strong> No utilizamos servicios de terceros para analizar tu comportamiento</li>
            <li><strong>Sin publicidad:</strong> No utilizamos tus datos para mostrar publicidad personalizada</li>
            <li><strong>Sin venta de datos:</strong> Nunca vendemos o alquilamos tu información</li>
          </ul>
          
          <h4>5.3 Servicios Técnicos</h4>
          <p>
            Solo utilizamos servicios técnicos básicos (como hosting) para mantener la aplicación funcionando, 
            pero estos servicios no tienen acceso a tus datos financieros personales.
          </p>
        </div>
      )
    },
    {
      id: "data-rights",
      title: "6. Tus Derechos",
      icon: <Lock size={20} />,
      content: (
        <div>
          <h4>6.1 Control de tus Datos</h4>
          <ul>
            <li><strong>Acceso:</strong> Puedes ver todos tus datos en la aplicación en cualquier momento</li>
            <li><strong>Edición:</strong> Puedes modificar, agregar o eliminar transacciones y categorías</li>
            <li><strong>Exportación:</strong> Puedes descargar tus datos en formato CSV desde la configuración</li>
            <li><strong>Eliminación:</strong> Puedes eliminar tu cuenta y todos tus datos</li>
          </ul>
          
          <h4>6.2 Funciones Disponibles</h4>
          <ul>
            <li>Crear y gestionar categorías de ingresos y gastos</li>
            <li>Establecer presupuestos por categoría</li>
            <li>Registrar transacciones manualmente</li>
            <li>Ver gráficos y estadísticas de tus finanzas</li>
            <li>Exportar datos para respaldo personal</li>
          </ul>
          
          <h4>6.3 Contacto</h4>
          <p>
            Si necesitas ayuda o tienes preguntas sobre tus datos:
          </p>
          <ul>
            <li>Utiliza la sección de configuración en la aplicación</li>
            <li>Contacta a soporte técnico por correo electrónico</li>
            <li>Consulta la documentación de la aplicación</li>
          </ul>
        </div>
      )
    },
    {
      id: "cookies",
      title: "7. Cookies y Tecnologías Similares",
      icon: <Database size={20} />,
      content: (
        <div>
          <h4>7.1 Uso de Cookies</h4>
          <ul>
            <li><strong>Cookies de sesión:</strong> Necesarias para mantener tu sesión activa mientras usas la aplicación</li>
            <li><strong>Cookies de preferencias:</strong> Recuerdan tu configuración de tema (claro/oscuro) y otras preferencias</li>
            <li><strong>Sin cookies de seguimiento:</strong> No utilizamos cookies para rastrear tu comportamiento</li>
            <li><strong>Sin cookies de publicidad:</strong> No utilizamos cookies para mostrar publicidad</li>
          </ul>
          
          <h4>7.2 Control de Cookies</h4>
          <p>
            Puedes controlar las cookies a través de la configuración de tu navegador. 
            Deshabilitar las cookies puede afectar algunas funciones básicas como mantener tu sesión activa.
          </p>
        </div>
      )
    },
    {
      id: "data-retention",
      title: "8. Retención de Datos",
      icon: <FileText size={20} />,
      content: (
        <div>
          <h4>8.1 Retención de Datos</h4>
          <ul>
            <li><strong>Datos de cuenta:</strong> Se mantienen mientras tu cuenta esté activa</li>
            <li><strong>Transacciones:</strong> Se conservan para que puedas acceder a tu historial financiero</li>
            <li><strong>Configuraciones:</strong> Se mantienen para personalizar tu experiencia</li>
            <li><strong>Sin análisis externos:</strong> No conservamos datos para análisis de terceros</li>
          </ul>
          
          <h4>8.2 Eliminación de Datos</h4>
          <p>
            Cuando elimines tu cuenta, procederemos a eliminar tu información personal de nuestros sistemas. 
            Puedes exportar tus datos antes de eliminar tu cuenta si deseas conservar un respaldo.
          </p>
        </div>
      )
    },
    {
      id: "children-privacy",
      title: "9. Privacidad de Menores",
      icon: <Shield size={20} />,
      content: (
        <div>
          <p>
            Esta aplicación está diseñada para uso personal de adultos. No recopilamos información 
            de menores de 16 años. Si un menor utiliza la aplicación, debe hacerlo bajo supervisión 
            de un adulto responsable.
          </p>
          <p>
            Si eres padre o tutor y necesitas ayuda con el uso de la aplicación por parte de un menor, 
            puedes contactarnos para obtener orientación.
          </p>
        </div>
      )
    },
    {
      id: "changes",
      title: "10. Cambios a esta Política",
      icon: <FileText size={20} />,
      content: (
        <div>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios 
            en la aplicación o mejoras en nuestros servicios.
          </p>
          <p>
            Te notificaremos sobre cambios importantes a través de:
          </p>
          <ul>
            <li>Notificación en la aplicación</li>
            <li>Actualización de la fecha "Última actualización" en esta página</li>
          </ul>
          <p>
            Te recomendamos revisar esta política ocasionalmente para mantenerte informado sobre 
            cómo manejamos tu información.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      title: "11. Contacto",
      icon: <Mail size={20} />,
      content: (
        <div>
          <p>
            Si tienes preguntas sobre esta Política de Privacidad o sobre el uso de la aplicación, 
            puedes contactarnos:
          </p>
          <ul>
            <li><strong>Correo electrónico:</strong> soporte@gestordegastos.com</li>
            <li><strong>Funciones de la app:</strong> Utiliza la sección de configuración para gestionar tus datos</li>
            <li><strong>Exportar datos:</strong> Puedes descargar tus datos desde la configuración</li>
          </ul>
          <p>
            Responderemos a tus consultas lo antes posible.
          </p>
        </div>
      )
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s ease',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
            >
              <ArrowLeft size={20} />
              Volver al Inicio
            </Link>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <Shield size={16} />
            <span>Última actualización: {lastUpdated}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Title Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '40px 0',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              padding: '16px',
              borderRadius: '16px',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
            }}>
              <Shield size={32} style={{ color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '800',
              color: '#1f2937',
              margin: 0
            }}>
              Política de Privacidad
            </h1>
          </div>
          
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Tu privacidad es nuestra prioridad. Conoce cómo protegemos y utilizamos tu información 
            para brindarte el mejor servicio de gestión financiera.
          </p>
        </div>

        {/* Table of Contents */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FileText size={24} />
            Índice de Contenidos
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.color = '#1d4ed8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {section.icon}
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                scrollMarginTop: '100px'
              }}
            >
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                {section.icon}
                {section.title}
              </h2>
              
              <div style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#374151'
              }}>
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)',
          borderRadius: '24px',
          padding: '48px',
          marginTop: '60px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '16px'
            }}>
              ¿Tienes Preguntas sobre Privacidad?
            </h3>
            <p style={{
              fontSize: '18px',
              marginBottom: '32px',
              opacity: 0.9
            }}>
              Nuestro equipo está aquí para ayudarte con cualquier consulta sobre el manejo de tus datos.
            </p>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <a
                href="mailto:privacidad@gestordegastos.com"
                style={{
                  background: 'white',
                  color: '#3b82f6',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                <Mail size={20} />
                Contactar Soporte
              </a>
              
              <Link
                to="/"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ArrowLeft size={20} />
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
        }}
        title="Volver arriba"
      >
        <ArrowLeft size={24} style={{ transform: 'rotate(90deg)' }} />
      </button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .privacy-policy h4 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 24px 0 12px 0;
        }
        
        .privacy-policy ul {
          margin: 16px 0;
          padding-left: 24px;
        }
        
        .privacy-policy li {
          margin: 8px 0;
          line-height: 1.6;
        }
        
        .privacy-policy strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .privacy-policy main {
            padding: 20px 16px;
          }
          
          .privacy-policy section {
            padding: 24px 20px;
          }
          
          .privacy-policy h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;