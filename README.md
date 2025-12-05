# RojeruAlert 🚀

Una librería de alertas JavaScript moderna, personalizable y con efectos visuales impresionantes.

## Características ✨

- ✅ **Múltiples tipos de alertas**: success, error, warning, info, question
- ✅ **Efectos visuales**: confeti, brillo, estrellas, fuegos artificiales
- ✅ **Temas**: claro/oscuro y personalizables
- ✅ **Animaciones**: zoom, slide, fade, flip, bounce
- ✅ **Soporte multi-idioma**: Español e Inglés
- ✅ **Sonidos**: opcionales para cada tipo
- ✅ **Sistema de notificaciones**: stack (toasts)
- ✅ **Formularios y prompts**: integrados
- ✅ **Loading y progress bars**: con spinners
- ✅ **Countdowns**: temporizadores integrados
- ✅ **Totalmente responsive**: se adapta a móviles
- ✅ **Accesible**: soporte para teclado y screen readers

## Instalación 📦

### CDN (Recomendado para HTML puro)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rojeru-alert@latest/dist/rojeru-alert.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/rojeru-alert@latest/dist/rojeru-alert.global.min.js"></script>
```
## NPM
npm install rojeru-alert

```
// ES Modules
import RojeruAlert from 'rojeru-alert';
import 'rojeru-alert/dist/rojeru-alert.css';

// CommonJS
const RojeruAlert = require('rojeru-alert');
require('rojeru-alert/dist/rojeru-alert.css');
```
## HTML puro (CDN)
```angular2html
<button onclick="RoAlert.success('¡Éxito!', 'Operación completada')">
  Mostrar Alerta
</button>

<script>
  // Ya disponible globalmente como:
  // window.RoAlert, window.roAlert, window.ro
  
  // Métodos directos:
  showSuccess('Título', 'Mensaje');
  
  // Con efectos:
  RoAlert.successWithConfetti('¡Felicidades!', 'Has ganado un premio');
</script>
```

## JavaScript (ES6+)
```
// Usando la instancia global
alert.success('¡Éxito!', 'Todo funcionó perfectamente');

// Crear nueva instancia
const myAlert = new RojeruAlert();
myAlert.info('Información', 'Este es un mensaje informativo');

// Métodos estáticos
RojeruAlert.warning('Advertencia', 'Ten cuidado con esto');
```
## Ejemplos Completos 🎨

```
// Success
RoAlert.success('¡Perfecto!', 'Los cambios se guardaron correctamente');

// Error
RoAlert.error('Oops!', 'Algo salió mal. Intenta nuevamente');

// Warning
RoAlert.warning('Cuidado', 'Esta acción no se puede deshacer');

// Info
RoAlert.info('Recordatorio', 'Tu sesión expirará en 5 minutos');

// Pregunta (confirmación)
RoAlert.question('¿Estás seguro?', '¿Deseas eliminar este elemento?')
  .then(confirmed => {
    if (confirmed) {
      // El usuario hizo clic en "Sí, continuar"
    }
  });
```

## Toast notifications
```
// Toast simple (desaparece en 3 segundos)
RoAlert.toast('Mensaje guardado correctamente');

// Toast con tipo específico
RoAlert.toast('Error al conectar', 5000, 'error');

// Toast con tema oscuro
RoAlert.toast('Modo nocturno activado', 3000, 'info', 'dark');
```
## Sistema de stack (notificaciones)
```
// Notificación en esquina
RoAlert.stack({
  message: 'Nuevo mensaje recibido',
  type: 'info',
  position: 'top-right',
  autoClose: 5000
});

// Múltiples notificaciones
RoAlert.stack({ message: 'Usuario conectado', type: 'success' });
RoAlert.stack({ message: 'Descarga completada', type: 'success' });
```
## Formularios y prompts
```
// Prompt simple
RoAlert.prompt({
  title: 'Ingresa tu nombre',
  placeholder: 'Escribe aquí...'
}).then(result => {
  if (result.confirmed) {
    console.log('Nombre:', result.value);
  }
});

// Formulario completo
RoAlert.form({
  title: 'Registro',
  fields: [
    { label: 'Nombre', required: true },
    { label: 'Email', type: 'email' },
    { label: 'Contraseña', type: 'password' }
  ]
}).then(result => {
  if (result.confirmed) {
    console.log('Datos:', result.data);
  }
});
```
## Loading y progress
```
// Loading simple
RoAlert.loading('Procesando', 'Por favor espera...');

// Loading con tamaño personalizado
RoAlert.loading('Cargando', 'Descargando archivos...', 'light', {
  size: 'large'
});

// Progress bar
RoAlert.progress({
  title: 'Procesando',
  message: 'Subiendo archivos...',
  duration: 5000
}).then(result => {
  console.log('Completado:', result.completed);
});

// Actualizar loading
const loading = RoAlert.loading('Procesando', '0%');
setTimeout(() => loading.updateLoading(50), 1000);
setTimeout(() => loading.updateLoading(100, '¡Completado!'), 2000);
```
## Countdown
```
// Temporizador
RoAlert.countdown({
  title: 'Sesión expirando',
  seconds: 10,
  message: 'Tu sesión expirará en:',
  onTick: (time) => {
    console.log('Tiempo restante:', time);
  }
}).then(result => {
  if (result.completed) {
    console.log('¡Tiempo completado!');
  }
});
```
## Personalización 🎨
```
Cambiar idioma
RoAlert.changeLanguage('es'); // Español
RoAlert.changeLanguage('en'); // Inglés (default)
```

```
Habilitar/deshabilitar sonidos
RoAlert.enableSounds(true); // Activado (default)
RoAlert.enableSounds(false); // Desactivado
```
```
Temas personalizados
// Registrar tema personalizado
RoAlert.registerTheme('midnight', {
  background: '#0f172a',
  text: '#e2e8f0',
  title: '#f1f5f9',
  subtext: '#94a3b8',
  primaryButton: '#8b5cf6',
  buttonText: 'white',
  secondaryButton: '#475569'
});

// Usar tema personalizado
RoAlert.success('¡Éxito!', 'Mensaje', {}, 'midnight');
```
```
Animaciones personalizadas
RoAlert.show({
  title: 'Animación especial',
  message: 'Con animación de flip',
  type: 'info',
  enterAnimation: 'flip',
  exitAnimation: 'bounce'
});
```
```
Configuración global
// Al cargar la librería
window.RoAlert.changeLanguage('es');
window.RoAlert.enableSounds(false);
```

## API Reference 📚
```
Métodos principales

show(options): Muestra una alerta personalizada
success(title, message, options, theme): Alerta de éxito
error(title, message, options, theme): Alerta de error
warning(title, message, options, theme): Alerta de advertencia
info(title, message, options, theme): Alerta informativa
question(title, message, options, theme): Alerta de confirmación
toast(message, time, type, theme): Notificación toast
prompt(options, callback): Diálogo de entrada
form(options): Formulario completo
loading(title, message, theme, options): Indicador de carga
stack(options): Notificación en stack
progress(options): Barra de progreso
countdown(options): Temporizador countdown
```
## Opciones disponibles
```
const options = {
  title: 'Título',           // Título de la alerta
  message: 'Mensaje',        // Contenido principal
  type: 'success',           // 'success', 'error', 'warning', 'info', 'question'
  theme: 'light',            // 'light', 'dark' o tema personalizado
  showCancel: false,         // Mostrar botón cancelar
  confirmButtonText: 'OK',   // Texto botón confirmar
  cancelButtonText: 'Cancel',// Texto botón cancelar
  closeOnClickOutside: true, // Cerrar al hacer clic fuera
  autoClose: 0,             // Cierre automático en ms (0 = desactivado)
  showProgress: false,      // Mostrar barra de progreso con autoClose
  enterAnimation: 'zoom',   // 'zoom', 'slide', 'fade', 'flip', 'bounce'
  exitAnimation: 'zoom',    // 'zoom', 'slide', 'fade', 'flip', 'bounce'
  playSound: true,          // Reproducir sonido
  onOpen: () => {},         // Callback al abrir
  callback: (confirmed) => {} // Callback al cerrar
};
```

## React ✅
```
npm install rojeru-alert
// App.jsx
import React from 'react';
import RojeruAlert from 'rojeru-alert';
import 'rojeru-alert/dist/rojeru-alert.css';

function App() {
  const showAlert = () => {
    // Usar directamente
    RoAlert.success('¡Desde React!', 'Funciona perfectamente');
  };

  return (
    <div>
      <button onClick={showAlert}>
        Mostrar Alerta
      </button>
    </div>
  );
}

export default App;
```
## Hook personalizado para React
```
// hooks/useAlert.js
import { useEffect, useRef } from 'react';
import RojeruAlert from 'rojeru-alert';
import 'rojeru-alert/dist/rojeru-alert.css';

export const useAlert = () => {
  const alertRef = useRef(null);
  
  useEffect(() => {
    // Crear instancia una sola vez
    if (!alertRef.current) {
      alertRef.current = new RojeruAlert();
    }
    
    // Limpiar al desmontar
    return () => {
      if (alertRef.current) {
        alertRef.current.clearAllStack();
        alertRef.current.clearTimeouts();
      }
    };
  }, []);
  
  return alertRef.current;
};

// Uso en componente
import { useAlert } from './hooks/useAlert';

function MyComponent() {
  const alert = useAlert();
  
  const handleClick = () => {
    alert.successWithConfetti('React Hook', 'Usando hook personalizado');
  };
  
  return <button onClick={handleClick}>Mostrar</button>;
}
```
## Context Provider para React
```
// context/AlertContext.jsx
import React, { createContext, useContext, useRef } from 'react';
import RojeruAlert from 'rojeru-alert';
import 'rojeru-alert/dist/rojeru-alert.css';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const alertRef = useRef(null);
  
  if (!alertRef.current) {
    alertRef.current = new RojeruAlert();
  }
  
  return (
    <AlertContext.Provider value={alertRef.current}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de AlertProvider');
  }
  return context;
};

// En tu App.jsx
import { AlertProvider } from './context/AlertContext';

function App() {
  return (
    <AlertProvider>
      <MyComponent />
    </AlertProvider>
  );
}
```
## Vue.js 3 ✅
```
// plugins/rojeru-alert.js
import RojeruAlert from 'rojeru-alert';
import 'rojeru-alert/dist/rojeru-alert.css';

const RojeruAlertPlugin = {
  install(app, options = {}) {
    // Crear instancia
    const alert = new RojeruAlert(options);
    
    // Inyectar globalmente en Options API
    app.config.globalProperties.$alert = alert;
    
    // Proveer para Composition API
    app.provide('rojeruAlert', alert);
    
    // Directiva personalizada
    app.directive('alert', {
      mounted(el, binding) {
        el.addEventListener('click', () => {
          const { type = 'info', title, message } = binding.value;
          alert[type](title, message);
        });
      }
    });
  }
};

export default RojeruAlertPlugin;

// En main.js
import { createApp } from 'vue';
import App from './App.vue';
import RojeruAlertPlugin from './plugins/rojeru-alert';

const app = createApp(App);
app.use(RojeruAlertPlugin);
app.mount('#app');
```
## Uso en componentes Vue
```
<!-- Options API -->
<template>
  <button @click="showSuccess">Mostrar Alerta</button>
</template>

<script>
export default {
  methods: {
    showSuccess() {
      this.$alert.success('¡Desde Vue!', 'Options API funcionando');
    }
  }
}
</script>

<!-- Composition API -->
<template>
  <button @click="showAlert">Mostrar</button>
  <button v-alert="{ type: 'info', title: 'Directiva', message: 'Usando directiva' }">
    Usar Directiva
  </button>
</template>

<script setup>
import { inject } from 'vue';

const alert = inject('rojeruAlert');

const showAlert = () => {
  alert.successWithConfetti('Composition API', '¡Funciona perfectamente!');
};
</script>
```
## Angular ✅
```
npm install rojeru-alert
// services/alert.service.ts
import { Injectable } from '@angular/core';
import RojeruAlert from 'rojeru-alert';
import 'rojeru-alert/dist/rojeru-alert.css';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alert: RojeruAlert;

  constructor() {
    this.alert = new RojeruAlert();
    // Configurar opciones globales
    this.alert.changeLanguage('es');
  }

  success(title: string, message: string) {
    return this.alert.success(title, message);
  }

  error(title: string, message: string) {
    return this.alert.error(title, message);
  }

  warning(title: string, message: string) {
    return this.alert.warning(title, message);
  }

  info(title: string, message: string) {
    return this.alert.info(title, message);
  }

  question(title: string, message: string) {
    return this.alert.question(title, message);
  }

  // Métodos con efectos
  successWithConfetti(title: string, message: string) {
    return this.alert.successWithConfetti(title, message);
  }

  // Toast
  toast(message: string, type: string = 'info') {
    return this.alert.toast(message, 3000, type);
  }
}

// En app.module.ts
import { AlertService } from './services/alert.service';

@NgModule({
  providers: [AlertService]
})
export class AppModule { }
```
## Uso en componente Angular
```
// app.component.ts
import { Component } from '@angular/core';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="showSuccess()">Mostrar Éxito</button>
    <button (click)="showConfetti()">¡Con Confeti!</button>
  `
})
export class AppComponent {
  constructor(private alertService: AlertService) {}

  showSuccess() {
    this.alertService.success('Angular', 'Funciona perfectamente con Angular');
  }

  showConfetti() {
    this.alertService.successWithConfetti('¡Felicidades!', 'Logro desbloqueado en Angular');
  }
}
```

## Funciona tambien con Svelte ✅, Next.js ✅, Nuxt.js ✅, SvelteKit ✅, Node.js (Electron, NW.js) ✅, TypeScript ✅
## ❤️ Donaciones
[![Donar](https://img.shields.io/badge/Donar-PayPal-00457C?logo=paypal&style=for-the-badge)](https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=JLWEAETTE3H28&ssrt=1764941769118)