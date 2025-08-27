/* #JS_CONFIG - Paste this at the top of JS file */
const CONFIG = {
    INTRO_DURATION_MS: 10000,
    DEMO_PASSWORD: "Qe00711634",
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
            // butonda karşı dil görünür
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
            tts: { title: "Metinden Ses", desc: "Metninizi profesyonel ses dosyasına dönüştürün", btn: "Başla" },
            clone: { title: "Ses Klonlama", desc: "Kendi sesinizi klonlayın ve kullanın", btn: "Başla" },
            podcast: { title: "Podcast Üret", desc: "Metninizi otomatik podcast'e çevirin", btn: "Başla" },
            stt: { title: "Ses → Metin", desc: "Ses kayıtlarınızı metne dönüştürün", btn: "Başla" }
        }
    },
    en: {
        intro: {
            title: "SoundAurora",
            tagline: "Studio-quality voice, instantly with AI.",
            small: "TTS • STT • Voice Cloning • Podcast",
            skip: "Skip",
            // butonda karşı dil görünür
            langDisplay: "TR"
        },
        modal: {
            title: "SoundAurora",
            subtitle: "Enter the password to access the platform",
            placeholder: "Enter password...",
            submit: "Login",
            error: "Wrong password! Please try again."
        },
        menu: {
            heroTitle: "Welcome to SoundAurora",
            heroSubtitle: "Voice cloning & podcast creation with AI",
            menuTitle: "Features",
            tts: { title: "Text to Speech", desc: "Turn your text into a pro voice file", btn: "Start" },
            clone: { title: "Voice Cloning", desc: "Clone and use your own voice", btn: "Start" },
            podcast: { title: "Generate Podcast", desc: "Turn your script into an automatic podcast", btn: "Start" },
            stt: { title: "Speech → Text", desc: "Transcribe your recordings into text", btn: "Start" }
        }
    }
};

/* #JS_STATE - Paste this after i18n data */
// Varsayılan dili EN yapıyoruz; kayıtlı tercih varsa onu kullanıyoruz.
let currentLang = (localStorage.getItem('preferredLang') || 'en');
let introTimer = null;

const state = {
    introCompleted: false,
    loginCompleted: false,
    currentLanguage: currentLang
};

/* Yardımcılar */
const $ = (sel) => document.querySelector(sel);
function setText(id, text){ const el = document.getElementById(id); if (el) el.textContent = text; }
function setPlaceholder(id, text){ const el = document.getElementById(id); if (el) el.placeholder = text; }
function show(el){ if (el) el.style.display = ''; }
function hide(el){ if (el) el.style.display = 'none'; }

/* Intro dosyası var mı? */
async function hasIntroFile() {
    try {
        const r = await fetch(CONFIG.VIDEO_PATH, { method: 'HEAD', cache: 'no-store' });
        const size = +(r.headers.get('content-length') || 0);
        return r.ok && size > 0;
    } catch { return false; }
}

/* #JS_INTRO_FLOW - Paste this after state */
async function initIntro() {
    const overlay   = $('#intro-overlay');
    const video     = $('#intro-video');
    const skipBtn   = $('#skip-intro');
    const langBtn   = $('#lang-toggle-intro');

    // Dil metinlerini uygula
    updateIntroText();

    // Videonun varlığını kontrol et
    const videoExists = await hasIntroFile();

    // Eğer "bir kez göster" açıksa ve daha önce gerçekten gösterildiyse atla
    const introSeen = localStorage.getItem('introSeen') === '1';

    if (!videoExists) {
        // Video yoksa intro’yu hiç göstermeden modala geç
        showLoginModal(false); // seen=false (kayıt tutma)
        return;
    }
    if (CONFIG.INTRO_SHOW_ONCE && introSeen) {
        showLoginModal(false); // tekrar intro göstermeyelim
        return;
    }

    // Intro görünür
    overlay.style.display = 'flex';

    // Video autoplay
    if (video && video.canPlayType('video/mp4')) {
        video.muted = true;
        video.playsInline = true;
        video.addEventListener('canplay', () => { video.play().catch(()=>{}); }, { once:true });
        video.addEventListener('ended',  () => showLoginModal(true), { once:true }); // seen=true (gerçekten izlendi)
        video.addEventListener('error',  () => showLoginModal(false), { once:true });
    }

    // Süre dolunca yine modala geç (failsafe)
    introTimer = setTimeout(() => {
        if (!state.loginCompleted) showLoginModal(videoExists); // video varsa seen=true say
    }, CONFIG.INTRO_DURATION_MS);

    // Skip
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try { video && video.pause(); } catch {}
            showLoginModal(true); // kullanıcı geçti → seen=true
        });
    }

    // Dil değiştir
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            toggleLanguage();
            updateIntroText();
        });
    }
}

function showLoginModal(markSeen) {
    if (state.loginCompleted) return;
    clearTimeout(introTimer);

    // Sadece video gerçekten varsa veya kullanıcı "Geç" dediyse seen işaretle
    if (CONFIG.INTRO_SHOW_ONCE && markSeen) {
        localStorage.setItem('introSeen', '1');
    }

    const overlay = $('#intro-overlay');
    const modal   = $('#login-modal');

    overlay?.classList.add('fade-out');
    setTimeout(() => {
        hide(overlay);
        modal?.classList.add('show');
        modal?.setAttribute('aria-hidden', 'false');
        const inp = $('#password-input');
        setTimeout(() => inp && inp.focus(), 100);
    }, 800);

    state.introCompleted = true;
}

function updateIntroText() {
    const d = I18N_DATA[currentLang].intro;
    setText('intro-title',  d.title);
    setText('intro-tagline',d.tagline);
    setText('intro-small',  d.small);
    setText('skip-text',    d.skip);
    const disp = $('#lang-display'); if (disp) disp.textContent = d.langDisplay;
    document.documentElement.lang = currentLang;
}

/* #JS_LOGIN_FLOW - Paste this after intro flow */
function initLoginForm() {
    const form = $('#login-form');
    const input = $('#password-input');
    const err = $('#error-message');
    const modal = $('#login-modal');

    updateModalText();

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = (input?.value || '').trim();
        if (pass === CONFIG.DEMO_PASSWORD) {
            err?.classList.remove('show');
            modal?.classList.remove('show');
            modal?.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                modal && (modal.style.display = 'none');
                showMainContent();
            }, 400);
            state.loginCompleted = true;
        } else {
            err && (err.textContent = I18N_DATA[currentLang].modal.error);
            err?.classList.add('show');
            if (input) {
                input.style.animation = 'shake 0.5s';
                setTimeout(() => { input.style.animation = ''; input.select(); }, 500);
            }
        }
    });

    input?.addEventListener('input', () => err?.classList.remove('show'));
}

function updateModalText() {
    const d = I18N_DATA[currentLang].modal;
    setText('modal-title', d.title);
    setText('modal-subtitle', d.subtitle);
    setPlaceholder('password-input', d.placeholder);
    const btnText = document.querySelector('.btn-text');
    if (btnText) btnText.textContent = d.submit;
}

function showMainContent() {
    const main = $('#main-content');
    if (main) {
        main.style.display = 'block';
        setTimeout(() => { main.style.opacity = '1'; main.style.transform = 'translateY(0)'; }, 100);
    }
    updateMenuText();

    const langToggleMain = $('#lang-toggle-main');
    langToggleMain?.addEventListener('click', () => {
        toggleLanguage();
        updateMenuText();
        // modal açıksa onu da güncelle
        const modalVisible = ($('#login-modal')?.style.display || '') !== 'none';
        if (modalVisible) updateModalText();
    });
}

/* #JS_I18N_RENDER - Paste this after login flow */
function updateMenuText() {
    const d = I18N_DATA[currentLang].menu;
    setText('hero-ti

