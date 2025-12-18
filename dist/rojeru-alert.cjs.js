'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// ==============================================

// Tu código original de RojeruAlert (sin modificar)
class RojeruAlert {
    constructor() {
        this.overlay = null;
        this.queue = [];
        this.isActive = false;
        this.timeoutIds = new Set();
        this.alertStack = [];
        this.stackPosition = { top: 20, right: 20 };
        this.plugins = {};
        this.language = 'en';
        this.soundsEnabled = true;
        // En el constructor, asegúrate de tener:
        this.texts = {
            es: {
                accept: 'Aceptar',
                confirm: '¿Estás seguro?',
                continue: 'Sí, continuar',
                loading: 'Cargando...',
                enterValue: 'Ingresa un valor',
                processing: 'Procesando...',
                countdown: 'Cuenta Regresiva',
                timeCompleted: '¡Tiempo completado!',
                isRequired: 'es requerido',
                invalidEmail: 'Email inválido',
                invalidFormat: 'Formato inválido',
                formTitle: 'Formulario',
                submit: 'Enviar',
                cancel: 'Cancelar',
                fieldRequired: 'Este campo es requerido',
                validationError: 'Error de validación',
                writeHere: 'Escribe aquí...',
                minLength: 'Debe tener al menos {n} caracteres',
                maxLength: 'No puede exceder {n} caracteres'
            },
            en: {
                accept: 'OK',
                confirm: 'Are you sure?',
                continue: 'Yes, continue',
                loading: 'Loading...',
                enterValue: 'Enter a value',
                processing: 'Processing...',
                countdown: 'Countdown',
                timeCompleted: 'Time completed!',
                isRequired: 'is required',
                invalidEmail: 'Invalid email',
                invalidFormat: 'Invalid format',
                formTitle: 'Form',
                submit: 'Submit',
                cancel: 'Cancel',
                fieldRequired: 'This field is required',
                validationError: 'Validation error',
                writeHere: 'Write here...',
                minLength: 'Must be at least {n} characters',
                maxLength: 'Cannot exceed {n} characters'
            }
        };
        this.customThemes = {};
        this.init();
    }

    init() {
        if (!document.getElementById('rojeru-alert-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'rojeru-alert-overlay';
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.getElementById('rojeru-alert-overlay');
        }

        // Initialize sounds
        this.sounds = {
            success: this.createSound(523, 0.3),
            error: this.createSound(349, 0.4),
            warning: this.createSound(392, 0.3),
            info: this.createSound(440, 0.2),
            question: this.createSound(494, 0.3)
        };
    }

    createSound(frequency, duration) {
        return () => {
            if (!this.soundsEnabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.warn('Could not play sounds:', e);
            }
        };
    }

    t(key) {
        return this.texts[this.language]?.[key] || key;
    }

    changeLanguage(language) {
        if (this.texts[language]) {
            this.language = language;
            // Actualizar textos de botones si hay un form abierto
            if (this.overlay && this.overlay.classList.contains('active')) {
                const confirmBtn = this.overlay.querySelector('.rojeru-alert-button.confirm');
                const cancelBtn = this.overlay.querySelector('.rojeru-alert-button.cancel');

                if (confirmBtn) {
                    confirmBtn.textContent = this.t('submit');
                }
                if (cancelBtn) {
                    cancelBtn.textContent = this.t('cancel');
                }
            }
        }
        return this;
    }

    enableSounds(enable = true) {
        this.soundsEnabled = enable;
        return this;
    }

    show(options = {}) {
        return new Promise((resolve) => {
            const alertConfig = {
                ...options,
                resolve
            };

            this.queue.push(alertConfig);

            if (!this.isActive) {
                this.processQueue();
            }
        });
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isActive = false;
            return;
        }

        this.isActive = true;
        const alertConfig = this.queue[0];
        this.showAlert(alertConfig);
    }

    showAlert(options = {}) {
        const {
            title = '',
            message = '',
            type = 'info',
            theme = 'light',
            showCancel = false,
            confirmButtonText = type === 'question' ? this.t('continue') : this.t('accept'),
            cancelButtonText = this.t('cancel'),
            closeOnClickOutside = true,
            autoClose = 0,
            showProgress = false,
            enterAnimation = 'zoom',
            exitAnimation = 'zoom',
            playSound = true,
            onOpen = null,
            callback = null,
            resolve = null
        } = options;

        // Play sound
        if (playSound && this.sounds[type]) {
            this.sounds[type]();
        }

        // Clear overlay
        this.overlay.innerHTML = '';
        this.overlay.className = '';

        const icons = {
            success: `<svg class="rojeru-alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10B981" opacity="0.15"/>
                <path d="M8 12.5L10.5 15L16 9" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,

            error: `<svg class="rojeru-alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#EF4444" opacity="0.15"/>
              <path d="M15 9L9 15M9 9l6 6" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
            </svg>`,

            warning: `<svg class="rojeru-alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#F59E0B" opacity="0.15"/>
                <path d="M12 8v4M12 16h0.01" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
              </svg>`,

            info: `<svg class="rojeru-alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="12" cy="12" r="10" fill="#3B82F6" opacity="0.15"/>
             <path d="M12 16v-4M12 8h0.01" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
           </svg>`,

            question: `<svg class="rojeru-alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#8B5CF6" opacity="0.15"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 16.5v.01" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round"/>
                </svg>`
        };

        const defaultTitles = {
            success: 'Perfect!',
            error: 'Something went wrong',
            warning: 'Attention',
            info: 'Important information',
            question: this.t('confirm')
        };

        const defaultTexts = {
            success: 'Your action was completed successfully.',
            error: 'There was a problem. Please try again.',
            warning: 'This action is irreversible.',
            info: 'Remember to check the details before continuing.',
            question: 'Are you sure you want to continue?'
        };

        // Build buttons according to configuration
        let buttonsHTML = '';
        if (showCancel) {
            buttonsHTML += `<button class="rojeru-alert-button cancel" data-focus="true">${cancelButtonText}</button>`;
        }

        if (confirmButtonText) {
            buttonsHTML += `<button class="rojeru-alert-button confirm" data-focus="${!showCancel}">${confirmButtonText}</button>`;
        }

        // Progress bar for autoClose
        const progressHTML = autoClose > 0 && showProgress ?
            `<div class="rojeru-alert-progress">
                <div class="rojeru-alert-progress-bar" style="animation-duration: ${autoClose}ms"></div>
            </div>` : '';

        const container = document.createElement('div');
        container.className = `rojeru-alert-container rojeru-alert-${type} theme-${theme} animation-${enterAnimation}`;

        if (autoClose > 0 && showProgress) {
            container.classList.add('with-progress');
        }

        container.innerHTML = `
            ${icons[type]}
            ${progressHTML}
            <h2 class="rojeru-alert-title">${title || defaultTitles[type]}</h2>
            <p class="rojeru-alert-text">${message || defaultTexts[type]}</p>
            <div class="rojeru-alert-buttons">
                ${buttonsHTML}
            </div>
        `;

        this.overlay.appendChild(container);

        // Force reflow for animation
        void this.overlay.offsetWidth;

        this.overlay.classList.add('active');
        container.classList.add('entering');

        // Execute onOpen callback after alert is visible
        if (onOpen && typeof onOpen === 'function') {
            setTimeout(() => {
                onOpen();
            }, 600);
        }

        // Configure auto close
        let autoCloseTimeout;
        if (autoClose > 0) {
            autoCloseTimeout = setTimeout(() => {
                this.finalizeAlert(callback, resolve, true, exitAnimation);
            }, autoClose);

            this.timeoutIds.add(autoCloseTimeout);
        }

        // Handle close on outside click
        const closeOnBackground = (e) => {
            if (closeOnClickOutside && e.target === this.overlay) {
                if (autoCloseTimeout) {
                    clearTimeout(autoCloseTimeout);
                    this.timeoutIds.delete(autoCloseTimeout);
                }
                this.finalizeAlert(callback, resolve, false, exitAnimation);
            }
        };

        if (closeOnClickOutside) {
            this.overlay.addEventListener('click', closeOnBackground);
        }

        // Buttons
        const confirmButton = container.querySelector('.confirm');
        const cancelButton = container.querySelector('.cancel');

        // Auto-focus on appropriate button
        setTimeout(() => {
            const focusButton = container.querySelector('[data-focus="true"]');
            if (focusButton) focusButton.focus();
        }, 100);

        const removeListeners = () => {
            if (closeOnClickOutside) {
                this.overlay.removeEventListener('click', closeOnBackground);
            }
            if (autoCloseTimeout) {
                clearTimeout(autoCloseTimeout);
                this.timeoutIds.delete(autoCloseTimeout);
            }
            document.removeEventListener('keydown', handleKeyboard);
        };

        const handleKeyboard = (e) => {
            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    removeListeners();
                    if (cancelButton) {
                        cancelButton.click();
                    } else {
                        this.finalizeAlert(callback, resolve, false, exitAnimation);
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (confirmButton) confirmButton.click();
                    break;
                case 'Tab':
                    e.preventDefault();
                    this.changeButtonFocus(confirmButton, cancelButton);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyboard);

        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                if (typeof callback === 'function') {
                    const result = callback(true);
                    if (result === false) {
                        // No cerrar el modal
                        return;
                    }
                }
                removeListeners();
                this.finalizeAlert(callback, resolve, true, exitAnimation);
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                if (typeof callback === 'function') {
                    const result = callback(false);
                    // A diferencia de "confirmar", normalmente no se bloquea el cierre al cancelar
                    // Pero si el callback explícitamente devuelve false, respetarlo (aunque es raro)
                    if (result === false) {
                        return;
                    }
                }
                removeListeners();
                this.finalizeAlert(null, resolve, false, exitAnimation); // callback ya se ejecutó
            });
        }
    }

    changeButtonFocus(confirmButton, cancelButton) {
        const active = document.activeElement;

        if (!active.classList.contains('rojeru-alert-button')) {
            if (confirmButton) confirmButton.focus();
        } else if (active === confirmButton && cancelButton) {
            cancelButton.focus();
        } else if (confirmButton) {
            confirmButton.focus();
        }
    }

    finalizeAlert(callback, resolve, confirmed, exitAnimation = 'zoom') {
        const container = this.overlay.querySelector('.rojeru-alert-container');
        if (container) {
            container.className = container.className.replace(/animation-\w+/, `animation-${exitAnimation}`);
            container.classList.add('exiting');
            setTimeout(() => {
                this.overlay.classList.remove('active');
                this.overlay.innerHTML = '';
                // ⚠️ ELIMINAMOS LA LLAMADA A callback() AQUÍ
                if (typeof resolve === 'function') resolve(confirmed);
                this.queue.shift();
                setTimeout(() => this.processQueue(), 100);
            }, 400);
        }
    }

    // ===== IMPROVED SPECIAL EFFECTS =====
    showEffect(type, element = null) {
        const target = element || document.body;

        switch(type) {
            case 'confetti':
                this.createConfetti(target);
                break;
            case 'shine':
                this.createShineEffect(target);
                break;
            case 'success':
                this.createSuccessEffect(target);
                break;
            case 'pulse':
                this.createPulseEffect(target);
                break;
            case 'stars':
                this.createStarsEffect(target);
                break;
            case 'fireworks':
                this.createFireworks(target);
                break;
        }
    }

    createConfetti(container) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'];
        const confettiCount = 150;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'rojeru-alert-confetti';

            const startX = Math.random() * window.innerWidth;
            const startY = -20;
            const size = Math.random() * 12 + 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const rotation = Math.random() * 360;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 1.5;
            const endX = (Math.random() * 200 - 100);

            confetti.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                top: ${startY}px;
                left: ${startX}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                opacity: 0.9;
                animation: rojeru-alert-confetti-fall ${duration}s ease-in ${delay}s forwards;
                z-index: 10001;
                pointer-events: none;
                transform: rotate(${rotation}deg);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            `;

            confetti.setAttribute('data-end-x', endX);
            document.body.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, (duration + delay) * 1000);
        }
    }

    createShineEffect(element) {
        // Create multiple concentric shine rings
        const rings = 3;

        for (let i = 0; i < rings; i++) {
            const ring = document.createElement('div');
            ring.className = 'rojeru-alert-shine-ring';

            const size = 100 + (i * 50);
            const duration = 1.5 + (i * 0.3);
            const delay = i * 0.2;

            ring.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border: 3px solid #3b82f6;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                animation: rojeru-alert-shine-expand ${duration}s ease-out ${delay}s forwards;
                pointer-events: none;
                z-index: 1;
            `;

            if (element && element.classList.contains('rojeru-alert-container')) {
                element.style.position = 'relative';
                element.appendChild(ring);

                setTimeout(() => {
                    if (ring.parentNode) {
                        ring.parentNode.removeChild(ring);
                    }
                }, (duration + delay) * 1000);
            }
        }

        // Also add shine to main container
        if (element) {
            element.classList.add('rojeru-alert-shining');
            setTimeout(() => {
                element.classList.remove('rojeru-alert-shining');
            }, 2000);
        }
    }

    createSuccessEffect(container) {
        // Create success particles exploding from center
        const successColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'rojeru-alert-success-particle';

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const duration = 0.8 + Math.random() * 0.7;
            const delay = Math.random() * 0.3;
            const size = 6 + Math.random() * 8;
            const color = successColors[Math.floor(Math.random() * successColors.length)];

            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: 50%;
                left: 50%;
                opacity: 0;
                animation: rojeru-alert-success-explosion ${duration}s ease-out ${delay}s forwards;
                z-index: 10001;
                pointer-events: none;
                box-shadow: 0 0 10px ${color};
                transform: translate(0, 0);
            `;

            particle.setAttribute('data-target-x', targetX);
            particle.setAttribute('data-target-y', targetY);

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (duration + delay) * 1000);
        }
    }

    createPulseEffect(element) {
        if (element) {
            // Create pulse waves
            const waves = 2;

            for (let i = 0; i < waves; i++) {
                const wave = document.createElement('div');
                wave.className = 'rojeru-alert-pulse-wave';

                const delay = i * 0.4;

                wave.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border: 2px solid #f59e0b;
                    border-radius: 20px;
                    opacity: 0;
                    animation: rojeru-alert-pulse-wave-animation 1.2s ease-out ${delay}s forwards;
                    pointer-events: none;
                    z-index: 1;
                `;

                element.style.position = 'relative';
                element.appendChild(wave);

                setTimeout(() => {
                    if (wave.parentNode) {
                        wave.parentNode.removeChild(wave);
                    }
                }, 1200 + (delay * 1000));
            }

            // Also add pulse class
            element.classList.add('rojeru-alert-pulsing');
            setTimeout(() => {
                element.classList.remove('rojeru-alert-pulsing');
            }, 3000);
        }
    }

    createStarsEffect(container) {
        // Create twinkling stars around container
        const starCount = 15;
        const colors = ['#ffd700', '#ffffff', '#ff6b6b', '#4ecdc4'];

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'rojeru-alert-star';

            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const duration = 1 + Math.random() * 1;
            const delay = Math.random() * 0.5;
            const size = 4 + Math.random() * 6;
            const color = colors[Math.floor(Math.random() * colors.length)];

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: 50%;
                left: 50%;
                opacity: 0;
                animation: rojeru-alert-star-twinkle ${duration}s ease-in-out ${delay}s forwards;
                z-index: 2;
                pointer-events: none;
                box-shadow: 0 0 8px ${color};
                transform: translate(${x}px, ${y}px) scale(0);
            `;

            if (container.classList.contains('rojeru-alert-container')) {
                container.style.position = 'relative';
                container.appendChild(star);

                setTimeout(() => {
                    if (star.parentNode) {
                        star.parentNode.removeChild(star);
                    }
                }, (duration + delay) * 1000);
            }
        }
    }

    createFireworks(container) {
        // Create fireworks in different positions
        const fireworkCount = 5;

        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                const centerX = 100 + Math.random() * (window.innerWidth - 200);
                const centerY = 100 + Math.random() * (window.innerHeight - 200);
                this.createFirework(centerX, centerY);
            }, i * 300);
        }
    }

    createFirework(centerX, centerY) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'rojeru-alert-firework-particle';

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 40 + Math.random() * 30;
            const duration = 1 + Math.random() * 0.5;
            const size = 3 + Math.random() * 4;
            const color = colors[Math.floor(Math.random() * colors.length)];

            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: ${centerY}px;
                left: ${centerX}px;
                opacity: 0;
                animation: rojeru-alert-firework-explosion ${duration}s ease-out forwards;
                z-index: 10001;
                pointer-events: none;
                box-shadow: 0 0 6px ${color};
                transform: translate(0, 0);
            `;

            particle.setAttribute('data-target-x', targetX);
            particle.setAttribute('data-target-y', targetY);

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);
        }
    }

    // ===== METHODS WITH INTEGRATED EFFECTS =====
    successWithConfetti(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'success',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            onOpen: () => {
                this.showEffect('confetti');
                this.showEffect('success');
            },
            ...additionalOptions
        });
    }

    infoWithShine(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'info',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            onOpen: () => {
                const container = this.overlay.querySelector('.rojeru-alert-container');
                if (container) {
                    this.showEffect('shine', container);
                    this.showEffect('stars', container);
                }
            },
            ...additionalOptions
        });
    }

    warningWithPulse(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'warning',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            onOpen: () => {
                const container = this.overlay.querySelector('.rojeru-alert-container');
                if (container) {
                    this.showEffect('pulse', container);
                }
            },
            ...additionalOptions
        });
    }

    successWithFireworks(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'success',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            onOpen: () => {
                this.showEffect('fireworks');
                this.showEffect('success');
            },
            ...additionalOptions
        });
    }

    // ===== SPECIAL ALERT METHODS =====
    toast(message, time = 3000, type = 'info', theme = 'light') {
        return this.show({
            title: '',
            message,
            type,
            theme,
            showCancel: false,
            confirmButtonText: '',
            closeOnClickOutside: true,
            autoClose: time,
            showProgress: true,
            enterAnimation: 'slide',
            exitAnimation: 'fade'
        });
    }

    // IMPROVED LOADING METHOD WITH MORE OPTIONS:
    loading(title='',message = this.t('loading'), theme = 'light', options = {}) {
        const {
            type = 'info',
            size = 'medium' // 'small', 'medium', 'large'
        } = options;

        const sizes = {
            small: '30px',
            medium: '50px',
            large: '70px'
        };

        return this.show({
            title: title,
            message: `
            <div class="rojeru-alert-loading-container">
                <div class="rojeru-alert-spinner" style="width: ${sizes[size]}; height: ${sizes[size]};"></div>
                <div class="rojeru-alert-loading-text">${message}</div>
            </div>
        `,
            type,
            theme,
            showCancel: false,
            confirmButtonText: '',
            closeOnClickOutside: false,
            enterAnimation: 'fade',
            playSound: false
        });
    }

    // Method to update loading with percentage
    updateLoading(percentage, message = null) {
        const container = this.overlay.querySelector('.rojeru-alert-loading-container');
        if (container) {
            const percentageElement = container.querySelector('.rojeru-alert-loading-percentage');
            const textElement = container.querySelector('.rojeru-alert-loading-text');

            if (percentageElement) {
                percentageElement.textContent = `${Math.min(100, Math.max(0, percentage))}%`;
            }

            if (message && textElement) {
                textElement.textContent = message;
            }
        }
    }

    prompt(options = {}, callback = null) {
        const {
            title = this.t('enterValue'),
            message = '',
            defaultValue = '',
            placeholder = this.t('writeHere'),
            type = 'info',
            theme = 'light',
            validation = null
        } = options;

        return new Promise((resolve) => {
            let capturedValue = defaultValue;
            let isResolved = false;
            const inputId = 'rojeru-alert-prompt-input-' + Date.now();
            const errorId = inputId + '-error';
            const globalErrorId = inputId + '-global-error';

            const inputHTML = `
            <div class="rojeru-alert-input-container">
                <input type="text"
                       id="${inputId}"
                       class="rojeru-alert-input"
                       value="${defaultValue}"
                       placeholder="${placeholder}"
                       autocomplete="off">
                <div class="rojeru-alert-field-error" id="${errorId}" style="display: none;"></div>
            </div>
        `;

            const globalErrorHTML = `
            <div class="rojeru-alert-global-error" id="${globalErrorId}" style="display: none;">
                <div class="rojeru-alert-error-icon">⚠️</div>
                <div class="rojeru-alert-error-text"></div>
            </div>
        `;

            const promptCallback = (confirmed) => {
                if (isResolved) return false;

                if (!confirmed) {
                    isResolved = true;
                    if (typeof callback === 'function') {
                        callback(false, capturedValue);
                    }
                    resolve({ confirmed: false, value: capturedValue });
                    return true;
                }

                // Limpiar errores previos
                this.clearPromptErrors(inputId);

                // Validación específica del campo
                let errorMessage = '';
                if (validation && typeof validation === 'function') {
                    const result = validation(capturedValue);
                    if (result !== true) {
                        errorMessage = result;
                    }
                }

                if (errorMessage) {
                    // Mostrar error debajo del campo
                    this.showPromptFieldError(inputId, errorMessage);

                    // Feedback visual
                    const container = this.overlay.querySelector('.rojeru-alert-container');
                    if (container) {
                        container.classList.add('validation-error');
                        setTimeout(() => container.classList.remove('validation-error'), 1000);
                    }

                    // Enfocar el campo
                    setTimeout(() => {
                        const input = document.getElementById(inputId);
                        if (input) input.focus();
                    }, 100);

                    return false; // ❌ No cerrar
                }

                // ✅ Válido → cerrar
                isResolved = true;
                if (typeof callback === 'function') {
                    callback(true, capturedValue);
                }
                resolve({ confirmed: true, value: capturedValue });
                return true;
            };

            const alertConfig = {
                title,
                message: message + globalErrorHTML + inputHTML,
                type,
                theme,
                showCancel: true,
                confirmButtonText: this.t('accept'),
                cancelButtonText: this.t('cancel'),
                closeOnClickOutside: false,
                callback: promptCallback
            };

            this.show(alertConfig);

            // Configurar input tras renderizado
            setTimeout(() => {
                const input = document.getElementById(inputId);
                if (!input) return;

                // Sincronizar valor
                const updateValue = () => {
                    capturedValue = input.value;
                };

                input.addEventListener('input', updateValue);
                input.addEventListener('change', updateValue);
                input.addEventListener('blur', updateValue);

                capturedValue = input.value;

                // Teclas: Enter → confirmar, Escape → cancelar
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        capturedValue = input.value;
                        const confirmBtn = this.overlay.querySelector('.rojeru-alert-button.confirm');
                        if (confirmBtn) confirmBtn.click();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        e.stopPropagation();
                        const cancelBtn = this.overlay.querySelector('.rojeru-alert-button.cancel');
                        if (cancelBtn) cancelBtn.click();
                    }
                });

                // Evitar que clics en input cierren el fondo
                ['click', 'mousedown', 'touchstart'].forEach(event => {
                    input.addEventListener(event, e => e.stopPropagation());
                });

                input.focus();
                input.select();
            }, 150);
        });
    }

    // Limpia errores del prompt
    clearPromptErrors(inputId) {
        const errorEl = document.getElementById(inputId + '-error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
        const input = document.getElementById(inputId);
        if (input) input.classList.remove('error');

        const globalError = document.getElementById(inputId + '-global-error');
        if (globalError) globalError.style.display = 'none';
    }

// Muestra error debajo del campo
    showPromptFieldError(inputId, message) {
        const errorEl = document.getElementById(inputId + '-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            const input = document.getElementById(inputId);
            if (input) input.classList.add('error');
        }
    }

    form(options = {}) {
        const {
            title = this.t('formTitle'),
            fields = [],
            confirmButtonText = null,
            cancelButtonText = null,
            validation = null,
            theme = 'light',
            language = null,
            playSound = true,
            closeOnClickOutside = false,
            autoClose = 0,
            showProgress = false,
            enterAnimation = 'zoom',
            exitAnimation = 'zoom',
            onOpen = null,
            ...restOptions
        } = options;

        return new Promise((resolve) => {
            const formId = 'rojeru-form-' + Date.now();
            let isResolved = false;

            const originalLanguage = this.language;
            if (language && this.texts[language]) {
                this.language = language;
            }

            const submitText = confirmButtonText || this.t('submit');
            const cancelText = cancelButtonText || this.t('cancel');
            const writeHereText = this.t('writeHere');
            const fieldRequiredText = this.t('fieldRequired');
            this.t('validationError');

            let formHTML = '';
            const fieldIds = [];
            fields.forEach((field, index) => {
                const fieldId = `${formId}-field-${index}`;
                fieldIds.push(fieldId);
                const fieldType = field.type || 'text';
                const placeholder = field.placeholder || writeHereText;
                const requiredAttr = field.required ? 'required' : '';
                const value = field.value || '';
                if (fieldType === 'textarea') {
                    formHTML += `
                    <div class="rojeru-alert-field">
                        <label for="${fieldId}">${field.label}</label>
                        <textarea id="${fieldId}" name="${field.name || fieldId}" placeholder="${placeholder}" ${requiredAttr} class="rojeru-alert-input rojeru-alert-textarea" rows="${field.rows || 4}">${value}</textarea>
                        <div class="rojeru-alert-field-error" id="${fieldId}-error"></div>
                    </div>
                `;
                } else if (fieldType === 'select') {
                    let optionsHTML = '';
                    if (field.options && Array.isArray(field.options)) {
                        field.options.forEach(option => {
                            const selected = option.value === value ? 'selected' : '';
                            optionsHTML += `<option value="${option.value}" ${selected}>${option.label}</option>`;
                        });
                    }
                    formHTML += `
                    <div class="rojeru-alert-field">
                        <label for="${fieldId}">${field.label}</label>
                        <select id="${fieldId}" name="${field.name || fieldId}" ${requiredAttr} class="rojeru-alert-input rojeru-alert-select">
                            ${optionsHTML}
                        </select>
                        <div class="rojeru-alert-field-error" id="${fieldId}-error"></div>
                    </div>
                `;
                } else {
                    const inputType = fieldType === 'checkbox' || fieldType === 'radio' ? fieldType : 'text';
                    const checkedAttr = (fieldType === 'checkbox' && value) ? 'checked' : '';
                    formHTML += `
                    <div class="rojeru-alert-field">
                        <label for="${fieldId}">${field.label}</label>
                        <input type="${inputType}" id="${fieldId}" name="${field.name || fieldId}" placeholder="${placeholder}" value="${inputType === 'checkbox' ? '' : value}" ${requiredAttr} ${checkedAttr} class="rojeru-alert-input">
                        <div class="rojeru-alert-field-error" id="${fieldId}-error"></div>
                    </div>
                `;
                }
            });

            const globalErrorId = `${formId}-global-error`;
            const globalErrorHTML = `
            <div class="rojeru-alert-global-error" id="${globalErrorId}" style="display: none;">
                <div class="rojeru-alert-error-icon">⚠️</div>
                <div class="rojeru-alert-error-text"></div>
            </div>
        `;

            // Callback que NO resuelve la promesa si hay errores
            const formCallback = (confirmed) => {
                if (isResolved) return false;

                if (!confirmed) {
                    isResolved = true;
                    this.language = originalLanguage;
                    resolve({ confirmed: false, data: {} });
                    return true; // permite cerrar al cancelar
                }

                // Función de validación
                const validateForm = () => {
                    const finalData = {};
                    let isValid = true;
                    let errorMessage = '';
                    let errorFieldId = null;

                    this.clearFormErrors(formId);

                    for (let i = 0; i < fields.length; i++) {
                        const field = fields[i];
                        const fieldId = fieldIds[i];
                        const fieldName = field.name || fieldId;
                        const input = this.overlay.querySelector(`#${fieldId}`);
                        if (!input) continue;

                        let value = '';
                        if (input.type === 'checkbox') {
                            value = input.checked;
                        } else if (input.type === 'radio') {
                            const selectedRadio = this.overlay.querySelector(`input[name="${fieldName}"]:checked`);
                            value = selectedRadio ? selectedRadio.value : '';
                        } else {
                            value = input.value;
                        }
                        finalData[fieldName] = value;

                        if (field.required && !value.toString().trim()) {
                            isValid = false;
                            errorFieldId = fieldId;
                            errorMessage = field.errorMessage || fieldRequiredText;
                            this.showFieldError(fieldId, errorMessage);
                            break;
                        }

                        if (isValid && field.validation && typeof field.validation === 'function') {
                            const validationResult = field.validation(value);
                            if (validationResult !== true) {
                                isValid = false;
                                errorFieldId = fieldId;
                                errorMessage = validationResult;
                                this.showFieldError(fieldId, validationResult);
                                break;
                            }
                        }
                    }

                    if (isValid && validation && typeof validation === 'function') {
                        const validationResult = validation(finalData);
                        if (validationResult !== true) {
                            isValid = false;
                            errorMessage = validationResult;
                            this.showGlobalError(formId, errorMessage);
                        }
                    }

                    return { isValid, finalData, errorMessage, errorFieldId };
                };

                const result = validateForm();
                if (!result.isValid) {
                    // Feedback visual
                    const container = this.overlay.querySelector('.rojeru-alert-container');
                    if (container) {
                        container.classList.add('validation-error');
                        setTimeout(() => container.classList.remove('validation-error'), 1000);
                    }

                    if (result.errorFieldId) {
                        setTimeout(() => {
                            const el = this.overlay.querySelector(`#${result.errorFieldId}`);
                            if (el) el.focus();
                        }, 100);
                    }

                    // NO cerrar el modal
                    return false;
                }

                // Si es válido, cerrar y resolver
                isResolved = true;
                this.language = originalLanguage;
                resolve({ confirmed: true, data: result.finalData });
                return true;
            };

            const alertConfig = {
                title,
                message: `
                <div class="rojeru-alert-form-container">
                    <form id="${formId}" class="rojeru-alert-form">
                        ${globalErrorHTML}
                        <div class="rojeru-alert-fields">${formHTML}</div>
                    </form>
                </div>
            `,
                type: 'info',
                theme,
                showCancel: true,
                confirmButtonText: submitText,
                cancelButtonText: cancelText,
                closeOnClickOutside,
                autoClose,
                showProgress,
                enterAnimation,
                exitAnimation,
                playSound,
                onOpen,
                callback: formCallback
            };

            this.show(alertConfig);

            // Configurar eventos del formulario tras renderizado
            setTimeout(() => {
                const formElement = this.overlay.querySelector(`#${formId}`);
                if (!formElement) return;

                setTimeout(() => {
                    const firstInput = formElement.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea, select');
                    if (firstInput) {
                        firstInput.focus();
                        if (firstInput.type === 'text' || firstInput.tagName === 'TEXTAREA') {
                            firstInput.select();
                        }
                    }
                }, 200);

                fields.forEach((field, index) => {
                    const fieldId = fieldIds[index];
                    const input = formElement.querySelector(`#${fieldId}`);
                    if (input) {
                        const clearError = () => {
                            this.showFieldError(fieldId, '');
                            const globalError = document.getElementById(globalErrorId);
                            if (globalError) globalError.style.display = 'none';
                        };
                        input.addEventListener('input', clearError);
                        input.addEventListener('change', clearError);
                        if (['checkbox', 'radio'].includes(input.type)) {
                            input.addEventListener('click', clearError);
                        }
                    }
                });

                formElement.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const confirmBtn = this.overlay.querySelector('.rojeru-alert-button.confirm');
                    if (confirmBtn) confirmBtn.click();
                });
            }, 150);
        });
    }

// Métodos auxiliares simplificados
    clearFormErrors(formId) {
        // Limpiar errores de campos
        const errorElements = document.querySelectorAll(`[id^="${formId}-field-"][id$="-error"]`);
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';

            const fieldId = el.id.replace('-error', '');
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('error');
            }
        });

        // Limpiar error global
        const globalError = document.getElementById(`${formId}-global-error`);
        if (globalError) {
            globalError.style.display = 'none';
            const errorText = globalError.querySelector('.rojeru-alert-error-text');
            if (errorText) errorText.textContent = '';
        }
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';

            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('error');
            }
        }
    }

    showGlobalError(formId, message) {
        const globalError = document.getElementById(`${formId}-global-error`);
        if (globalError) {
            const errorText = globalError.querySelector('.rojeru-alert-error-text');
            if (errorText) {
                errorText.textContent = message;
                globalError.style.display = 'flex';
            }
        }
    }

    progress(options = {}) {
        const {
            title = this.t('processing'),
            message = '',
            duration = 5000,
            onProgress = null
        } = options;

        return new Promise((resolve) => {
            let progress = 0;
            const interval = 50;
            const steps = duration / interval;
            const increment = 100 / steps;

            const alertConfig = {
                title,
                message: `
                    <div class="rojeru-alert-progress-container">
                        <div class="rojeru-alert-progress-bar-container">
                            <div class="rojeru-alert-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="rojeru-alert-progress-text">0%</div>
                        ${message ? `<div class="rojeru-alert-progress-message">${message}</div>` : ''}
                    </div>
                `,
                type: 'info',
                showCancel: false,
                confirmButtonText: '',
                closeOnClickOutside: false,
                enterAnimation: 'fade',
                playSound: false
            };

            this.show(alertConfig);

            const intervalId = setInterval(() => {
                progress += increment;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(intervalId);
                    setTimeout(() => {
                        this.close();
                        resolve({ completed: true, progress: 100 });
                    }, 500);
                }

                const fill = this.overlay.querySelector('.rojeru-alert-progress-fill');
                const text = this.overlay.querySelector('.rojeru-alert-progress-text');

                if (fill) fill.style.width = progress + '%';
                if (text) text.textContent = Math.round(progress) + '%';

                if (onProgress) onProgress(progress);
            }, interval);
        });
    }

    countdown(options = {}) {
        const {
            title = this.t('countdown'),
            seconds = 10,
            onTick = null,
            message = '',
            completionMessage = this.t('timeCompleted')
        } = options;

        let timeRemaining = seconds;

        return new Promise((resolve) => {
            const alertConfig = {
                title,
                message: `
                    <div class="rojeru-alert-countdown">
                        <div class="rojeru-alert-time">${timeRemaining}s</div>
                        ${message ? `<div class="rojeru-alert-message">${message}</div>` : ''}
                    </div>
                `,
                type: 'warning',
                showCancel: true,
                confirmButtonText: this.t('cancel'),
                autoClose: seconds * 1000,
                callback: (confirmed) => {
                    if (!confirmed) {
                        resolve({ completed: true, timeRemaining: 0 });
                    } else {
                        resolve({ completed: false, timeRemaining });
                    }
                }
            };

            this.show(alertConfig);

            const interval = setInterval(() => {
                timeRemaining--;
                const timeElement = this.overlay.querySelector('.rojeru-alert-time');
                if (timeElement) {
                    timeElement.textContent = timeRemaining + 's';
                    if (timeRemaining <= 5) {
                        timeElement.classList.add('urgent');
                    }
                }

                if (onTick) onTick(timeRemaining);

                if (timeRemaining <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        });
    }

    // ===== STACK SYSTEM (NOTIFICATIONS) =====
    stack(options = {}) {
        const {
            message = '',
            type = 'info',
            theme = 'light',
            autoClose = 5000,
            position = 'top-right',
            enterAnimation = 'slide',
            exitAnimation = 'fade'
        } = options;

        const alertId = 'rojeru-stack-' + Date.now();
        const stackItem = document.createElement('div');
        stackItem.className = `rojeru-alert-stack-item rojeru-alert-${type} theme-${theme} animation-${enterAnimation}`;
        stackItem.id = alertId;
        stackItem.innerHTML = `
            <div class="rojeru-alert-stack-content">
                <span class="rojeru-alert-stack-message">${message}</span>
                <button class="rojeru-alert-stack-close">&times;</button>
            </div>
        `;

        this.updateStackPosition(position, stackItem);
        document.body.appendChild(stackItem);

        setTimeout(() => stackItem.classList.add('entering'), 10);

        stackItem.querySelector('.rojeru-alert-stack-close').addEventListener('click', () => {
            this.closeStackItem(alertId, exitAnimation);
        });

        if (autoClose > 0) {
            setTimeout(() => {
                this.closeStackItem(alertId, exitAnimation);
            }, autoClose);
        }

        this.alertStack.push(alertId);
        return alertId;
    }

    updateStackPosition(position, element) {
        const positions = {
            'top-right': { top: '20px', right: '20px', left: 'auto' },
            'top-left': { top: '20px', left: '20px', right: 'auto' },
            'bottom-right': { bottom: '20px', right: '20px', left: 'auto' },
            'bottom-left': { bottom: '20px', left: '20px', right: 'auto' }
        };

        Object.assign(element.style, positions[position] || positions['top-right']);
    }

    closeStackItem(id, exitAnimation) {
        const item = document.getElementById(id);
        if (item) {
            item.classList.add('exiting');
            setTimeout(() => {
                item.remove();
                this.alertStack = this.alertStack.filter(itemId => itemId !== id);
            }, 400);
        }
    }

    // ===== CUSTOM THEMES SYSTEM =====
    registerTheme(name, colors) {
        this.customThemes[name] = colors;
        this.applyThemeStyles(name, colors);
        return this;
    }

    applyThemeStyles(name, colors) {
        const styleId = `rojeru-theme-${name}`;
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .rojeru-alert-container.theme-${name} {
                background: ${colors.background};
                color: ${colors.text};
                border: ${colors.border || 'none'};
            }
            .rojeru-alert-container.theme-${name} .rojeru-alert-title {
                color: ${colors.title || colors.text};
            }
            .rojeru-alert-container.theme-${name} .rojeru-alert-text {
                color: ${colors.subtext || colors.text};
            }
            .rojeru-alert-container.theme-${name} .rojeru-alert-button.confirm {
                background: ${colors.primaryButton};
                color: ${colors.buttonText || 'white'};
            }
            .rojeru-alert-container.theme-${name} .rojeru-alert-button.cancel {
                background: ${colors.secondaryButton || '#f1f5f9'};
                color: ${colors.secondaryButtonText || '#475569'};
            }
        `;
        document.head.appendChild(style);
    }

    // ===== PLUGIN SYSTEM =====
    use(plugin, options = {}) {
        if (typeof plugin.install === 'function') {
            plugin.install(this, options);
            this.plugins[plugin.name] = { plugin, options };
        }
        return this;
    }

    // ===== UTILITY METHODS =====
    close() {
        this.finalizeAlert(null, null, false, 'zoom');
    }

    clearQueue() {
        this.queue = [];
        this.isActive = false;
        return this;
    }

    getQueueLength() {
        return this.queue.length;
    }

    clearTimeouts() {
        this.timeoutIds.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        this.timeoutIds.clear();
        return this;
    }

    clearAllStack() {
        this.alertStack.forEach(id => {
            const item = document.getElementById(id);
            if (item) item.remove();
        });
        this.alertStack = [];
        return this;
    }

    // ===== SHORTCUT METHODS =====
    success(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'success',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            ...additionalOptions
        });
    }

    error(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'error',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            ...additionalOptions
        });
    }

    warning(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'warning',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            ...additionalOptions
        });
    }

    info(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'info',
            theme: typeof theme === 'string' ? theme : 'light',
            callback,
            ...additionalOptions
        });
    }

    question(title = '', message = '', options = {}, theme = 'light') {
        let callback = null;
        let additionalOptions = {};

        if (typeof options === 'function') {
            callback = options;
        } else if (typeof options === 'object') {
            additionalOptions = options;
            callback = theme;
        }

        return this.show({
            title,
            message,
            type: 'question',
            theme: typeof theme === 'string' ? theme : 'light',
            showCancel: true,
            callback,
            ...additionalOptions
        });
    }

    // ===== STATIC METHODS =====
    static show(options = {}) {
        const instance = new RojeruAlert();
        return instance.show(options);
    }

    static success(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.success(title, message, options, theme);
    }

    static error(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.error(title, message, options, theme);
    }

    static warning(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.warning(title, message, options, theme);
    }

    static info(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.info(title, message, options, theme);
    }

    static question(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.question(title, message, options, theme);
    }

    static toast(message, time = 3000, type = 'info', theme = 'light') {
        const instance = new RojeruAlert();
        return instance.toast(message, time, type, theme);
    }

    static prompt(options = {}, callback = null) {
        const instance = new RojeruAlert();
        return instance.prompt(options, callback);
    }

    static form(options = {}) {
        const instance = new RojeruAlert();
        return instance.form(options);
    }

    static stack(options = {}) {
        const instance = new RojeruAlert();
        return instance.stack(options);
    }

    static progress(options = {}) {
        const instance = new RojeruAlert();
        return instance.progress(options);
    }

    static countdown(options = {}) {
        const instance = new RojeruAlert();
        return instance.countdown(options);
    }

    // Static methods with effects
    static successWithConfetti(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.successWithConfetti(title, message, options, theme);
    }

    static infoWithShine(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.infoWithShine(title, message, options, theme);
    }

    static warningWithPulse(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.warningWithPulse(title, message, options, theme);
    }

    static successWithFireworks(title = '', message = '', options = {}, theme = 'light') {
        const instance = new RojeruAlert();
        return instance.successWithFireworks(title, message, options, theme);
    }

    // Static method for direct effects
    static showEffect(type, element = null) {
        const instance = new RojeruAlert();
        instance.showEffect(type, element);
    }
}

// EXAMPLE PLUGIN: ANALYTICS
const AnalyticsPlugin = {
    name: 'analytics',
    install: (alert, options) => {
        const originalShow = alert.show.bind(alert);

        alert.show = function(options) {
            if (options.tracking) {
                console.log('Alert shown:', {
                    type: options.type,
                    timestamp: new Date().toISOString(),
                    ...options.metadata
                });
            }

            return originalShow(options);
        };
    }
};

// Versión de la librería
const VERSION = '1.0.7';

// Instancia global pre-creada
const globalInstance = new RojeruAlert();

// Métodos globales directos
const show = (options) => RojeruAlert.show(options);
const success = (title, message, options, theme) => RojeruAlert.success(title, message, options, theme);
const error = (title, message, options, theme) => RojeruAlert.error(title, message, options, theme);
const warning = (title, message, options, theme) => RojeruAlert.warning(title, message, options, theme);
const info = (title, message, options, theme) => RojeruAlert.info(title, message, options, theme);
const question = (title, message, options, theme) => RojeruAlert.question(title, message, options, theme);
const toast = (message, time, type, theme) => RojeruAlert.toast(message, time, type, theme);
const prompt = (options, callback) => RojeruAlert.prompt(options, callback);
const loading = (title, message, theme, options) => RojeruAlert.loading(title, message, theme, options);

// ==============================================
// DETECCIÓN AUTOMÁTICA DE ENTORNO
// ==============================================

const detectEnvironment = () => {
    // Si estamos en un navegador
    if (typeof window !== 'undefined') {
        // Exportar a window para uso global
        window.RojeruAlert = RojeruAlert;
        window.RoAlert = globalInstance;
        window.roAlert = globalInstance;
        window.ro = globalInstance;

        // Métodos directos en window
        window.showAlert = (options) => globalInstance.show(options);
        window.showSuccess = (title, message, options, theme) =>
            globalInstance.success(title, message, options, theme);
        window.showError = (title, message, options, theme) =>
            globalInstance.error(title, message, options, theme);
        window.showWarning = (title, message, options, theme) =>
            globalInstance.warning(title, message, options, theme);
        window.showInfo = (title, message, options, theme) =>
            globalInstance.info(title, message, options, theme);
        window.showQuestion = (title, message, options, theme) =>
            globalInstance.question(title, message, options, theme);
        window.showToast = (message, time, type, theme) =>
            globalInstance.toast(message, time, type, theme);
        window.showLoading = (title, message, theme, options) =>
            globalInstance.loading(title, message, theme, options);

        // Plugins
        window.RojeruAlertPluginAnalytics = AnalyticsPlugin;

        // Información de versión
        window.RojeruAlertVersion = VERSION;
    }

    // Si estamos en Node.js/CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = RojeruAlert;
        module.exports.default = RojeruAlert;
        module.exports.RojeruAlert = RojeruAlert;
        module.exports.alert = globalInstance;
        module.exports.VERSION = VERSION;
        module.exports.AnalyticsPlugin = AnalyticsPlugin;
    }

    // Si estamos en AMD (RequireJS)
    if (typeof define === 'function' && define.amd) {
        define('RojeruAlert', [], () => ({
            default: RojeruAlert,
            RojeruAlert,
            alert: globalInstance,
            VERSION,
            AnalyticsPlugin,
            show,
            success,
            error,
            warning,
            info,
            question,
            toast,
            prompt,
            loading
        }));
    }
};

// Ejecutar detección automática
detectEnvironment();

exports.AnalyticsPlugin = AnalyticsPlugin;
exports.RojeruAlert = RojeruAlert;
exports.VERSION = VERSION;
exports.alert = globalInstance;
exports["default"] = RojeruAlert;
exports.error = error;
exports.info = info;
exports.loading = loading;
exports.prompt = prompt;
exports.question = question;
exports.show = show;
exports.success = success;
exports.toast = toast;
exports.warning = warning;
