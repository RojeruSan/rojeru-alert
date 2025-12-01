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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rojeru-alert/dist/rojeru-alert.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/rojeru-alert/dist/rojeru-alert.global.min.js"></script>
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

## Plugins 🔌
```
RoAlert.use(RojeruAlertPluginAnalytics, {
  trackAll: true
});
```
## Crear tu propio plugin
```
const MyPlugin = {
  name: 'my-plugin',
  install: (alert, options) => {
    // Extender la funcionalidad
    alert.myCustomMethod = function() {
      console.log('Plugin activado!');
    };
  }
};

RoAlert.use(MyPlugin);
```