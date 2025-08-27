// Configuration
const CONFIG = {
    PASSWORD: "quynh_demo_001",
    INTRO_DURATION: 22000, // 22 seconds
    DEFAULT_LANG: "tr"
};

// Language Data
const LANG_DATA = {
    tr: {
        intro: {
            tagline: "Yapay zekâ ile stüdyo kalitesinde ses",
            subtitle: "TTS • STT • Ses Klonlama • Podcast",
            skip: "Geç"
        },
        login: {
            tagline: "Yapay zekâ ile stüdyo kalitesinde hız",
            subtitle: "TTS • STT • Ses Klonlama • Podcast",
            title: "Platforma Giriş",
            desc: "Platforma erişmek için şifre girin",
            placeholder: "Şifreyi girin...",
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
            tagline: "Fast, studio-quality voice by AI",
            subtitle: "TTS • STT • Voice Cloning • Podcast",
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
const introOverlay = document.getElementById('introOverlay');
const loginModal = document.getElementById('loginModal');
const mainContent = document.getElementById('mainContent');
const langToggle = document.getElementById('langToggle');
const skipBtn = document.getElementById('skipBtn');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const errorMsg = document.getElementById('errorMsg');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadLanguage();
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
    updateLanguageDisplay();
}

function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('sa.lang', currentLang);
    updateLanguageDisplay();
}

function updateLanguageDisplay() {
    const data = LANG_DATA[currentLang];
    
    // Language toggle button
    langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    
    // Intro texts
    if (document.getElementById('introTagline')) {
        document.getElementById('introTagline').textContent = data.intro.tagline;
        document.getElementById('introSubtitle').textContent = data.intro.subtitle;
        skipBtn.textContent = data.intro.skip;
    }
    
    // Login texts
    if (document.getElementById('loginTagline')) {
        document.getElementById('loginTagline').textContent = data.login.tagline;
        document.getElementById('loginSubtitle').textContent = data.login.subtitle;
        document.getElementById('loginTitle').textContent = data.login.title;
        document.getElementById('loginDesc').textContent = data.login.desc;
        passwordInput.placeholder = data.login.placeholder;
        document.getElementById('loginBtn').textContent = data.login.button;
    }
    
    // Main content texts
    if (document.getElementById('heroTitle')) {
        document.getElementById('heroTitle').textContent = data.main.heroTitle;
        document.getElementById('heroDesc').textContent = data.main.heroDesc;
        document.getElementById('featuresTitle').textContent = data.main.featuresTitle;
        
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

// Intro Functions
function initIntro() {
    // Show intro for 22 seconds
    introTimer = setTimeout(() => {
        showLogin();
    }, CONFIG.INTRO_DURATION);
    
    // Skip button
    skipBtn.addEventListener('click', () => {
        clearTimeout(introTimer);
        showLogin();
    });
}

function showLogin() {
    introOverlay.classList.add('hidden');
    
    setTimeout(() => {
        introOverlay.style.display = 'none';
        loginModal.classList.add('show');
        passwordInput.focus();
    }, 800);
}

// Login Functions
function initLogin() {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
}

function handleLogin() {
    const password = passwordInput.value.trim();
    
    if (password === CONFIG.PASSWORD) {
        // Success
        errorMsg.classList.remove('show');
        loginModal.classList.remove('show');
        
        setTimeout(() => {
            loginModal.style.display = 'none';
            showMainContent();
        }, 400);
        
    } else {
        // Error
        const data = LANG_DATA[currentLang];
        errorMsg.textContent = data.login.error;
        errorMsg.classList.add('show');
        
        // Shake animation
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
            passwordInput.select();
        }, 500);
    }
}

function showMainContent() {
    mainContent.style.display = 'block';
    updateLanguageDisplay();
    
    // Fade in animation
    setTimeout(() => {
        mainContent.style.opacity = '1';
    }, 100);
}

// Language Toggle
function initLanguageToggle() {
    langToggle.addEventListener('click', () => {
        toggleLanguage();
    });
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
        z-index: 3000;
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        opacity: 0;
        transition: all 0.3s ease;
        text-align: center;
        max-width: 300px;
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
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeCSS);