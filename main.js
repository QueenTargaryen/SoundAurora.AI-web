/* #JS_CONFIG - Paste this at the top of JS file */
const CONFIG = {
    INTRO_DURATION_MS: 10000,
    DEMO_PASSWORD: "quynh_demo_001",
    INTRO_SHOW_ONCE: true,
    VIDEO_PATH: "assets/intro.mp4"
};
/* #JS_I18N_DATASETS - Paste this after config */
const I18N_DATA = {
    tr: {
        intro: {
            title: "SoundAurora",
            tagline: "Yapay zekâ ile hızlı, stüdyo kalitesinde ses.",
            small: "TTS • STT • Ses Klonlama • Podcast",
            skip: "Geç",
            langDisplay: "EN"
        },
        modal: {
            title: "SoundAurora",
            subtitle: "Platforma erişim için parolayı girin",
            placeholder: "Parola girin...",
            submit: "Giriş",
            error: "Hatalı parola! Lütfen tekrar deneyin."
        },
        menu: {
            heroTitle: "SoundAurora'ya Hoş Geldiniz",
            heroSubtitle: "Yapay zeka ile ses klonlama ve podcast üretimi",
            menuTitle: "Özellikler",
            tts: {
                title: "Metinden Ses",
                desc: "Metninizi profesyonel ses dosyasına dönüştürün",
                btn: "Başla"
            },
            clone: {
                title: "Ses Klonlama",
                desc: "Kendi sesinizi klonlayın ve kullanın",
                btn: "Başla"
            },
            podcast: {
                title: "Podcast Üret",
                desc: "Metninizi otomatik podcast'e çevirin",
                btn: "Başla"
            },
            stt: {
                title: "Ses → Metin",
                desc: "Ses kayıtlarınızı metne dönüştürün",
                btn: "Başla"
            }
        }
    },
    en: {
        intro: {
            title: "SoundAurora",
            tagline: "Fast, studio-quality voice by AI.",
            small: "TTS • STT • Voice Cloning • Podcast",
            skip: "Skip",
            langDisplay: "TR"
        },
        modal: {
            title: "SoundAurora",
            subtitle: "Enter password to access platform",
            placeholder: "Enter password...",
            submit: "Login",
            error: "Wrong password! Please try again."
        },
        menu: {
            heroTitle: "Welcome to SoundAurora",
            heroSubtitle: "AI-powered voice cloning and podcast generation",
            menuTitle: "Features",
            tts: {
                title: "Text to Speech",
                desc: "Convert your text to professional audio files",
                btn: "Start"
            },
            clone: {
                title: "Voice Cloning",
                desc: "Clone and use your own voice",
                btn: "Start"
            },
            podcast: {
                title: "Generate Podcast",
                desc: "Convert your text to automatic podcast",
                btn: "Start"
            },
            stt: {
                title: "Speech → Text",
                desc: "Convert your audio recordings to text",
                btn: "Start"
            }
        }
    }
};

/* #JS_STATE - Paste this after i18n data */
let currentLang = 'tr';
let introShown = false;
let introTimer = null;

const state = {
    introCompleted: false,
    loginCompleted: false,
    currentLanguage: 'tr'
};
/* #JS_INTRO_FLOW - Paste this after state */
function initIntro() {
    const overlay = document.getElementById('intro-overlay');
    const video = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');
    const langToggle = document.getElementById('lang-toggle-intro');
    // Check if intro should be shown
    if (CONFIG.INTRO_SHOW_ONCE && localStorage.getItem('introSeen')) {
        showLoginModal();
        return;
    }
    
    // Show intro
    overlay.style.display = 'flex';
    // Try to load and play video
    if (video.canPlayType('video/mp4')) {
        video.addEventListener('loadeddata', () => {
            video.play().catch(() => {
                // Video failed to play, continue with timer
                console.log('Video autoplay failed, showing poster');
            });
        });
        
        video.addEventListener('ended', () => {
            showLoginModal();
        });
        video.addEventListener('error', () => {
            console.log('Video failed to load, showing poster');
        });
    }
    
    // Set timer to show login modal after duration
    introTimer = setTimeout(() => {
        if (!state.loginCompleted) {
            showLoginModal();
        }
    }, CONFIG.INTRO_DURATION_MS);
    // Skip button handler
    skipBtn.addEventListener('click', () => {
        clearTimeout(introTimer);
        showLoginModal();
    });
    // Language toggle for intro
    langToggle.addEventListener('click', () => {
        toggleLanguage();
        updateIntroText();
    });
    // Initialize intro text
    updateIntroText();
}

function showLoginModal() {
    if (state.loginCompleted) return;
    
    clearTimeout(introTimer);
    // Mark intro as seen
    if (CONFIG.INTRO_SHOW_ONCE) {
        localStorage.setItem('introSeen', 'true');
    }
    
    // Hide intro with fade
    const overlay = document.getElementById('intro-overlay');
    const modal = document.getElementById('login-modal');
    
    overlay.classList.add('fade-out');
    
    setTimeout(() => {
        overlay.style.display = 'none';
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus password input
        const passwordInput = document.getElementById('password-input');
        setTimeout(() => passwordInput.focus(), 100);
    }, 800);
    state.introCompleted = true;
}

function updateIntroText() {
    const data = I18N_DATA[currentLang].intro;
    
    document.getElementById('intro-title').textContent = data.title;
    document.getElementById('intro-tagline').textContent = data.tagline;
    document.getElementById('intro-small').textContent = data.small;
    document.getElementById('skip-text').textContent = data.skip;
    document.getElementById('lang-display').textContent = data.langDisplay;
}

/* #JS_LOGIN_FLOW - Paste this after intro flow */
function initLoginForm() {
    const form = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const modal = document.getElementById('login-modal');
    
    // Update modal text
    updateModalText();
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        if (password === CONFIG.DEMO_PASSWORD) {
            // Success
            errorMessage.classList.remove('show');
            
            // Hide modal and show main content
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            setTimeout(() => {
                modal.style.display = 'none';
                showMainContent();
            }, 400);
            
            state.loginCompleted = true;
        } else {
            // Error
            errorMessage.textContent = I18N_DATA[currentLang].modal.error;
            errorMessage.classList.add('show');
            
            // Shake animation
            passwordInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                passwordInput.style.animation = '';
                passwordInput.select();
            }, 500);
        }
    });
    
    // Clear error on input
    passwordInput.addEventListener('input', () => {
        errorMessage.classList.remove('show');
    });
}

function updateModalText() {
    const data = I18N_DATA[currentLang].modal;
    
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('password-input').placeholder = data.placeholder;
    document.querySelector('.btn-text').textContent = data.submit;
}

function showMainContent() {
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'block';
    // Update all text content
    updateMenuText();
    
    // Initialize main language toggle
    const langToggleMain = document.getElementById('lang-toggle-main');
    langToggleMain.addEventListener('click', () => {
        toggleLanguage();
        updateMenuText();
        // Update modal text if still visible
        if (!document.getElementById('login-modal').style.display !== 'none') {
            updateModalText();
        }
    });
    // Add entrance animation
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);
}

/* #JS_I18N_RENDER - Paste this after login flow */
function updateMenuText() {
    const data = I18N_DATA[currentLang].menu;
    // Update hero section
    document.getElementById('hero-title').textContent = data.heroTitle;
    document.getElementById('hero-subtitle').textContent = data.heroSubtitle;
    document.getElementById('menu-title').textContent = data.menuTitle;
    // Update menu cards
    document.getElementById('tts-title').textContent = data.tts.title;
    document.getElementById('tts-desc').textContent = data.tts.desc;
    document.getElementById('tts-btn').textContent = data.tts.btn;
    
    document.getElementById('clone-title').textContent = data.clone.title;
    document.getElementById('clone-desc').textContent = data.clone.desc;
    document.getElementById('clone-btn').textContent = data.clone.btn;
    
    document.getElementById('podcast-title').textContent = data.podcast.title;
    document.getElementById('podcast-desc').textContent = data.podcast.desc;
    document.getElementById('podcast-btn').textContent = data.podcast.btn;
    
    document.getElementById('stt-title').textContent = data.stt.title;
    document.getElementById('stt-desc').textContent = data.stt.desc;
    document.getElementById('stt-btn').textContent = data.stt.btn;
    
    // Update language display
    const langDisplay = document.getElementById('lang-display-main');
    if (langDisplay) {
        langDisplay.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    }
}

/* #JS_I18N_TOGGLE - Paste this after i18n render */
function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    state.currentLanguage = currentLang;
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    // Save language preference
    localStorage.setItem('preferredLang', currentLang);
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && I18N_DATA[savedLang]) {
        currentLang = savedLang;
        state.currentLanguage = savedLang;
        document.documentElement.lang = currentLang;
    }
}

/* #JS_MENU_PLACEHOLDERS - Paste this after language toggle */
function initMenuHandlers() {
    // Add click handlers for menu cards
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        const feature = card.dataset.feature;
        const btn = card.querySelector('.card-btn');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleFeatureClick(feature);
        });
        
        card.addEventListener('click', () => {
            handleFeatureClick(feature);
        });
        
        // Keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFeatureClick(feature);
            }
        });
    });
}

function handleFeatureClick(feature) {
    // Placeholder functionality
    const messages = {
        tr: {
            tts: "Metinden ses özelliği yakında gelecek!",
            clone: "Ses klonlama özelliği yakında gelecek!",
            podcast: "Podcast üretimi özelliği yakında gelecek!",
            stt: "Ses → metin özelliği yakında gelecek!"
        },
        en: {
            tts: "Text-to-speech feature coming soon!",
            clone: "Voice cloning feature coming soon!",
            podcast: "Podcast generation feature coming soon!",
            stt: "Speech-to-text feature coming soon!"
        }
    };
    
    const message = messages[currentLang][feature] || "Feature coming soon!";
    // Create and show temporary notification
    showNotification(message);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
        color: var(--primary-black);
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add shake animation to CSS (inject via JS)
function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load language preference first
    loadLanguagePreference();
    
    // Add animations
    addShakeAnimation();
    
    // Initialize components
    initIntro();
    initLoginForm();
    
    // Initialize menu handlers when main content is shown
    setTimeout(() => {
        if (state.loginCompleted) {
            initMenuHandlers();
        }
    }, 1000);
    
    // Fallback: if no intro is shown within 1 second, show login
    setTimeout(() => {
        if (!state.introCompleted && !state.loginCompleted) {
            showLoginModal();
        }
    }, 1000);
});
// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    const video = document.getElementById('intro-video');
    if (document.hidden && video && !video.paused) {
        video.pause();
    }
});