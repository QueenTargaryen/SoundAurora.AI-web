// Configuration
const CONFIG = {
    PASSWORD: "quynh_demo_001",
    INTRO_DURATION: 22000, // 22 seconds
    DEFAULT_LANG: "en"
};

// Language Data
const LANG_DATA = {
    tr: {
        intro: {
            tagline: "Profesyonel stüdyo sesi artık yapay zeka gücüyle sizin elinizde.",
            subtitle: "TTS • STT • Ses Klonlama • Podcast • E-Kitap • VPS",
            skip: "Geç"
        },
        login: {
            tagline: "Profesyonel stüdyo sesi artık yapay zeka gücüyle sizin elinizde.",
            subtitle: "TTS • STT • Ses Klonlama • Podcast • E-Kitap • VPS",
            title: "Platforma Giriş",
            desc: "Platforma erişmek için şifre girin",
            placeholder: "Şifrenizi girin...", 
            button: "Giriş",
            error: "Hatalı şifre! Lütfen tekrar deneyin."
        },
        main: {
            heroTitle: "SoundAurora'ya Hoş Geldiniz",
            heroDesc: "Yapay zeka ile ses klonlama ve podcast platformu",
            featuresTitle: "Özellikler",
            tts: {
                title: "Metinden Ses (TTS)",
                desc: "Metninizi profesyonel ses dosyasına dönüştürün",
                btn: "Başla"
            },
            stt: {
                title: "Ses → Metin (STT)",
                desc: "Ses kayıtlarınızı metne dönüştürün",
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
            aibook: {
                title: "AI Book",
                desc: "Uzun makale ve bölümleri dinleyin",
                btn: "Başla"
            },
            soon: {
                title: "Çok Yakında",
                desc: "Yeni yaratıcı ses araçları yolda",
                btn: "Yakında"
            }
        }
    },
    en: {
        intro: {
            tagline: "Professional studio voice, now in your hands with AI power.",
            subtitle: "TTS • STT • Voice Clone • Podcast • E-Book • VPS",
            skip: "Skip"
        },
        login: {
            tagline: "Fast, studio-quality voice by AI",
            subtitle: "TTS • STT • Voice Cloning • Podcast",
            title: "Platform Access",
            desc: "Enter password to access platform",
            placeholder: "Enter password...",
            button: "Login",
            error: "Wrong password! Please try again."
        },
        main: {
            heroTitle: "Welcome to SoundAurora",
            heroDesc: "AI-powered voice cloning and podcast platform",
            featuresTitle: "Features",
            tts: {
                title: "Text to Speech (TTS)",
                desc: "Convert your text to professional audio files",
                btn: "Start"
            },
            stt: {
                title: "Speech → Text (STT)",
                desc: "Convert your audio recordings to text",
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
            aibook: {
                title: "AI Book",
                desc: "Listen to long-form articles and chapters",
                btn: "Start"
            },
            soon: {
                title: "Coming Soon",
                desc: "New creative voice tools are on the way",
                btn: "Soon"
            }
        }
    }
};

// Global Variables
let currentLang = CONFIG.DEFAULT_LANG;
let introTimer = null;

// DOM Elements
let introOverlay, loginModal, mainContent, langToggle, skipBtn, loginForm, passwordInput, errorMsg;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    introOverlay = document.getElementById('introOverlay');
    loginModal = document.getElementById('loginModal');
    mainContent = document.getElementById('mainContent');
    langToggle = document.getElementById('langToggle');
    skipBtn = document.getElementById('skipBtn');
    loginForm = document.getElementById('loginForm');
    passwordInput = document.getElementById('passwordInput');
    errorMsg = document.getElementById('errorMsg');

    // Initialize
    loadLanguage();
    updateLanguageDisplay();
    initIntro();
    initLogin();
    initLanguageToggle();
    initFeatureButtons();
});

// Language Functions
function loadLanguage() {
    const saved = localStorage.getItem('sa.lang');
    if (saved && LANG_DATA[saved]) {
        currentLang = saved;
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('sa.lang', currentLang);
    updateLanguageDisplay();
}

function updateLanguageDisplay() {
    const data = LANG_DATA[currentLang];
    
    // Language toggle button
    if (langToggle) {
        langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    }
    
    // Intro texts
    const introTagline = document.getElementById('introTagline');
    const introSubtitle = document.getElementById('introSubtitle');
    
    if (introTagline && introSubtitle) {
        introTagline.textContent = data.intro.tagline;
        introSubtitle.textContent = data.intro.subtitle;
        if (skipBtn) skipBtn.textContent = data.intro.skip;
    }
    
    // Login texts
    const loginTagline = document.getElementById('loginTagline');
    const loginSubtitle = document.getElementById('loginSubtitle');
    const loginTitle = document.getElementById('loginTitle');
    const loginDesc = document.getElementById('loginDesc');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginTagline && loginSubtitle && loginTitle && loginDesc && loginBtn) {
        loginTagline.textContent = data.login.tagline;
        loginSubtitle.textContent = data.login.subtitle;
        loginTitle.textContent = data.login.title;
        loginDesc.textContent = data.login.desc;
        passwordInput.placeholder = data.login.placeholder;
        loginBtn.textContent = data.login.button;
    }
    
    // Main content texts
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    const featuresTitle = document.getElementById('featuresTitle');
    
    if (heroTitle && heroDesc && featuresTitle) {
        heroTitle.textContent = data.main.heroTitle;
        heroDesc.textContent = data.main.heroDesc;
        featuresTitle.textContent = data.main.featuresTitle;
        
        // Feature cards
        updateFeatureCard('tts', data.main.tts);
        updateFeatureCard('stt', data.main.stt);
        updateFeatureCard('clone', data.main.clone);
        updateFeatureCard('podcast', data.main.podcast);
        updateFeatureCard('aibook', data.main.aibook);
        updateFeatureCard('soon', data.main.soon);
    }
}

function updateFeatureCard(feature, data) {
    const titleEl = document.getElementById(feature + 'Title');
    const descEl = document.getElementById(feature + 'Desc');
    const btnEl = document.getElementById(feature + 'Btn');
    
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (btnEl) btnEl.textContent = data.btn;
}

// FIXED: Intro Functions
function initIntro() {
    // Start 22-second timer
    introTimer = setTimeout(() => {
        showLogin();
    }, CONFIG.INTRO_DURATION);
    
    // Show skip button after 7 seconds
    setTimeout(() => {
        if (skipBtn) {
            skipBtn.style.display = 'block';
            skipBtn.style.opacity = '0';
            setTimeout(() => {
                skipBtn.style.opacity = '1';
            }, 50);
        }
    }, 7000); // 7 seconds
    
    // Skip button handler
    if (skipBtn) {
        skipBtn.style.display = 'none'; // Initially hidden
        skipBtn.addEventListener('click', () => {
            clearTimeout(introTimer);
            showLogin();
        });
    }
    
    // Video handling
    const video = document.querySelector('.intro-video');
    if (video) {
        video.addEventListener('loadeddata', () => {
            video.play().catch(() => {
                console.log('Video autoplay failed');
            });
        });
    }
}

// FIXED: Show login modal with proper transitions
function showLogin() {
    if (!introOverlay || !loginModal) return;
    
    // Clear timer
    clearTimeout(introTimer);
    
    // Hide intro overlay with animation
    introOverlay.classList.add('hidden');
    
    // Show login modal after intro fades
    setTimeout(() => {
        // Ensure intro is completely hidden
        introOverlay.style.display = 'none';
        
        // Show login modal
        loginModal.style.display = 'flex';
        loginModal.classList.add('show');
        
        // Focus password input after modal animation
        setTimeout(() => {
            if (passwordInput) {
                passwordInput.focus();
            }
        }, 200);
        
    }, 800); // Wait for intro fade animation
}

// Login Functions
function initLogin() {
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // Clear error on input
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            if (errorMsg) {
                errorMsg.classList.remove('show');
            }
        });
    }
}

function handleLogin() {
    if (!passwordInput) return;
    
    const password = passwordInput.value.trim();
    
    if (password === CONFIG.PASSWORD) {
        // Success - hide login and show main content
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
        
        loginModal.classList.remove('show');
        
        setTimeout(() => {
            loginModal.style.display = 'none';
            showMainContent();
        }, 400);
        
    } else {
        // Error - show error message
        const data = LANG_DATA[currentLang];
        if (errorMsg) {
            errorMsg.textContent = data.login.error;
            errorMsg.classList.add('show');
        }
        
        // Shake animation
        if (passwordInput) {
            passwordInput.style.animation = 'shake 0.6s ease-in-out';
            setTimeout(() => {
                passwordInput.style.animation = '';
                passwordInput.select();
            }, 600);
        }
    }
}

function showMainContent() {
    if (!mainContent) return;
    
    mainContent.style.display = 'block';
    updateLanguageDisplay();
    
    // Fade in animation
    setTimeout(() => {
        mainContent.classList.add('show');
    }, 100);
}

// Language Toggle
function initLanguageToggle() {
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            toggleLanguage();
        });
    }
}

// Feature Buttons
function initFeatureButtons() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const feature = card.dataset.feature;
        const btn = card.querySelector('.feature-btn');
        
        if (btn && !btn.disabled) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleFeatureClick(feature);
            });
            
            card.addEventListener('click', () => {
                handleFeatureClick(feature);
            });
        }
    });
}

function handleFeatureClick(feature) {
    const messages = {
        tr: {
            tts: "Metinden Ses özelliği yakında gelecek!",
            stt: "Ses → Metin özelliği yakında gelecek!",
            clone: "Ses Klonlama özelliği yakında gelecek!",
            podcast: "Podcast Üretimi özelliği yakında gelecek!",
            aibook: "AI Book özelliği yakında gelecek!",
            soon: "Bu özellik çok yakında gelecek!"
        },
        en: {
            tts: "Text to Speech feature coming soon!",
            stt: "Speech to Text feature coming soon!",
            clone: "Voice Cloning feature coming soon!",
            podcast: "Podcast Generation feature coming soon!",
            aibook: "AI Book feature coming soon!",
            soon: "This feature is coming very soon!"
        }
    };
    
    const message = messages[currentLang][feature] || "Feature coming soon!";
    showNotification(message);
}

function showNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
        color: var(--primary-black);
        padding: 20px 30px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 16px;
        z-index: 4000;
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        opacity: 0;
        transition: all 0.3s ease;
        text-align: center;
        max-width: 300px;
        border: 2px solid var(--gold-primary);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1.05)';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add shake animation CSS
const shakeCSS = document.createElement('style');
shakeCSS.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
`;
document.head.appendChild(shakeCSS);