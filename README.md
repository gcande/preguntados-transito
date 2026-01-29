# TránsitoQuiz Colombia (MVP) 🚦✨

¡Bienvenido a **TránsitoQuiz**! Un juego web interactivo tipo "Preguntados" diseñado para ayudar a los colombianos a estudiar el **Código Nacional de Tránsito** de una forma divertida, visual y moderna.

Este proyecto es un MVP (Producto Mínimo Viable) desarrollado íntegramente en el frontend para demostrar la experiencia de usuario y el flujo del juego.

---

## 🌟 Características Principales

- **Contenido Oficial**: 60 preguntas divididas en 4 categorías clave:
  - 🛑 **Señales de Tránsito**: Identificación y significado de señales preventivas, reglamentarias e informativas.
  - 🛣️ **Normas de Tránsito**: Prioridades en vía, velocidades máximas y reglas generales.
  - 📝 **Infracciones y Sanciones**: Todo sobre multas, SMLDV y procedimientos de tránsito.
  - 🔧 **Mecánica y Seguridad**: Conocimientos básicos de mantenimiento y elementos de seguridad activa/pasiva.
- **Experiencia de Juego**: 
  - Temporizador de 15 segundos por pregunta.
  - Sistema de puntaje (10 puntos por respuesta correcta).
  - Feedback visual instantáneo (temblor en fallos, brillo en aciertos).
  - Resumen detallado de efectividad al finalizar cada ronda de 10 preguntas.
- **Diseño Premium**: Interfaz basada en *Glassmorphism* con animaciones fluidas, gradients vibrantes y responsive design (totalmente funcional en móviles).

---

## 🛠️ Tecnologías

Este MVP se construyó utilizando el stack más moderno para garantizar rapidez y fluidez:

- **React 19** (Vite): Base del proyecto para un rendimiento óptimo.
- **Tailwind CSS**: Para un diseño estilizado, consistente y adaptado a cualquier pantalla.
- **Framer Motion**: Motor de animaciones para transiciones entre pantallas y feedback interactivo.
- **Howler.js**: Gestión profesional de sonidos (acierto, error y tiempo agotado).
- **JavaScript (ES6+)**: Lógica limpia y modular sin dependencias externas innecesarias.

---

## 🚀 Instrucciones de Ejecución

Para correr este proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio** (o descargar el código).
2. **Instalar las dependencias**:
   ```bash
   npm install
   ```
3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. **Abrir en el navegador**:
   Visita la URL que te indique la terminal (usualmente `http://localhost:5173`).

---

## 🌐 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente mediante **GitHub Actions**. Sigue estos pasos para activarlo en tu repositorio:

1.  **Configurar la Fuente**:
    *   Ve a la pestaña **Settings** de tu repositorio en GitHub.
    *   En el menú izquierdo, selecciona **Pages**.
    *   En la sección **Build and deployment > Source**, selecciona **GitHub Actions** en el menú desplegable.
2.  **Despliegue Automático**:
    *   Cada vez que hagas un `push` a la rama `main`, el workflow se activará automáticamente.
    *   Puedes seguir el progreso en la pestaña **Actions**.
3.  **Configuración de Vite**:
    *   Asegúrate de que en `vite.config.js` el campo `base` coincida con el nombre de tu repositorio: `base: '/preguntados-transito/'`.

---

## 📂 Estructura del Código

- `/src/hooks/useGame.js`: Cerebro del juego. Gestiona estados, temporizadores y sonidos.
- `/src/data/questions.js`: Base de datos mock con el banco de preguntas.
- `/src/components`: Componentes atómicos y reutilizables (Timer, Progress, Cards).
- `/src/pages`: Vistas principales del flujo (Home, Categories, Game, Result).
- `/src/styles`: Estilos globales y definiciones de animaciones personalizadas.

---

## 📝 Recomendaciones para el Futuro

Como experto frontend, recomiendo escalar este MVP de la siguiente manera:
1. **TypeScript**: Migrar a TS para mayor robustez en el manejo de tipos de preguntas.
2. **Backend/Database**: Implementar una API (Node/Express) y una base de datos (PostgreSQL/MongoDB) para persistir puntajes globales y líderes.
3. **Internacionalización**: Adaptar las preguntas para otros códigos de tránsito de Latinoamérica.
5. **PWA**: Convertir el juego en una Progressive Web App para que los usuarios puedan "instalarla" y jugar sin conexión.

## Link
```bash
https://gcande.github.io/preguntados-transito/
```

---
**Desarrollado como MVP para entrenamiento de conducción • 2026**
