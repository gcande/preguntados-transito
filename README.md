# TránsitoQuiz Colombia | Elite Edition 🚦✨

¡Bienvenido a **TránsitoQuiz**! Un ecosistema educativo premium diseñado para dominar el **Código Nacional de Tránsito de Colombia**. Lo que comenzó como un MVP ha evolucionado a una plataforma robusta, segura y escalable con arquitectura moderna.

---

## 🌟 Características Principales

- **Contenido Oficial y Dinámico**: Banco de preguntas gestionado en tiempo real vía Supabase.
  - 🛑 **Señales de Tránsito** | 🛣️ **Normas de Tránsito** | 📝 **Infracciones** | 🔧 **Mecánica**
- **Sistema de Roles Avanzado**:
  - **Admin**: Acceso total al CRUD de preguntas y gestión de directorio de usuarios.
  - **Jugador**: Acceso al simulador de examen y seguimiento de progreso.
- **Seguridad Garantizada**: Implementación de **Supabase Auth** con persistencia de sesión individual y cifrado de datos.
- **Experiencia Premium**: 
  - Interfaz *Glassmorphism* evolucionada con animaciones de **Framer Motion**.
  - Feedback háptico visual y auditivo profesional.
  - Soporte **PWA** para instalación como aplicación móvil nativa.

---

## 🛠️ Stack Tecnológico

- **Core**: React 19 + TypeScript (Tipado estricto para máxima robustez).
- **Backend & Auth**: Supabase (PostgreSQL + Auth Service).
- **Estilos**: Tailwind CSS + Custom Design System con variables HSL.
- **Animaciones**: Framer Motion (Transitions, AnimatePresence, Layout animations).
- **Sonido**: Howler.js (Audio multi-canal).
- **Build Tool**: Vite + TypeScript Config.

---

## 📂 Directorio del Proyecto

```text
/
├── src/
│   ├── components/       # Componentes de interfaz (Layout, Cards, UI)
│   ├── hooks/            # useGame.ts (Motor lógico del examen)
│   ├── lib/              # Configuraciones (supabase.ts)
│   ├── modules/          # Módulos de gestión (Dashboard, Questions, Users)
│   ├── pages/            # Vistas principales (Home, Login, Game, Result)
│   ├── styles/           # CSS Global y animaciones personalizadas
│   ├── types/            # Definiciones de interfaces globales (.ts)
│   └── main.tsx          # Punto de entrada de la aplicación
├── .env                  # Variables de entorno (Supabase Keys)
├── tsconfig.json         # Configuración de TypeScript
└── vite.config.ts        # Configuración de Vite y PWA
```

---

## 🛡️ Seguridad y Roles

### Sesión Individual
Cada usuario cuenta con un token **JWT** único que garantiza que su progreso, respuestas y permisos sean totalmente privados. El aislamiento se maneja en tres niveles:
1. **Cliente**: React state aislado por pestaña.
2. **Navegador**: LocalStorage encriptado por sesión de Supabase.
3. **Servidor**: Row Level Security (RLS) en la base de datos para prevenir accesos no autorizados.

### Jerarquía de Acceso
- **Autenticación Directa**: Email + Cédula (sirve como contraseña).
- **Auto-Activación**: El administrador puede pre-registrar usuarios, y el sistema los activa automáticamente en su primer ingreso sin fricciones.

---

## 🚀 Comandos del Proyecto

### Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor local con Hot Reload
npm run dev
```

### Producción e Implementación
```bash
# Compilar proyecto y generar bundle optimizado
npm run build

# Previsualizar la versión de producción localmente
npm run preview

# Verificar errores de tipos con TypeScript
npm run type-check
```

---

## 🌐 Despliegue
La aplicación está configurada para desplegarse en **GitHub Pages** mediante GitHub Actions. 
Base URL: `https://gcande.github.io/preguntados-transito/`

---
**TránsitoQuiz Team • Ingeniería de Software Educativa • 2026**
