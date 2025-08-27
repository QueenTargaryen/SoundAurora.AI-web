/* ========= SoundAurora - main.js =========
   İSTENENLER:
   - Açılış dili EN
   - assets/intro.mp4 oynasın; 10 sn sınırı + Skip
   - Intro bittiğinde parola modali açılsın
   - Parola kutusunun ÜSTÜNDE 3 satırlık başlık görünsün
   - Kutu içindeki başlık gizlensin
   - Intro bir kez gösterilsin (INTRO_SHOW_ONCE=true)
   - TR↔EN dil butonları çalışsın
================================================= */

/* #JS_CONFIG */
const CONFIG = {
  INTRO_DURATION_MS: 10000,
  DEMO_PASSWORD: "quynh_demo_001",
  INTRO_SHOW_ONCE: true,
  VIDEO_PATH: "assets/intro.mp4",
  LS_LANG: "preferredLang",
  LS_INTRO: "introSeen"
};

/* #JS_I18N_DATASETS */
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
      tts: { title: "Metinden Ses", desc: "Metninizi profesyonel ses dosyasına dönüştürün", btn: "Başla" },
      clone: { title: "Ses Klonlama", desc: "Kendi sesinizi klonlayın ve kullanın", btn: "Başla" },
      podcast: { title: "Podcast Üret", desc: "Metninizi otomatik podcast'e çevirin", btn: "Başla" },
      stt: { title: "Ses → Metin", desc: "Ses kayıtlarınızı metne dönüştürün", btn: "Başla" }
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
      tts: { title: "Text to Speech", desc: "Convert your text to professional audio files", btn: "Start" },
      clone: { title: "Voice Cloning", desc: "Clone and use your own voice", btn: "Start" },
      podcast: { title: "Generate Podcast", desc: "Convert your text to automatic podcast", btn: "Start" },
      stt: { title: "Speech → Text", desc: "Convert your audio recordings to text", btn: "Start" }
    }
  }
};

/* #JS_STATE */
let currentLang = "en";                   // EN başlangıç
let introTimer = null;

const state = {
  introCompleted: false,
  loginCompleted: false,
  currentLanguage: "en"
};

/* ========= HELPERS ========= */

const $ = (s) => document.querySelector(s);

function updateIntroText() {
  const data = I18N_DATA[currentLang].intro;
  $("#intro-title").textContent = data.title;
  $("#intro-tagline").textContent = data.tagline;
  $("#intro-small").textContent = data.small;
  $("#skip-text").textContent = data.skip;
  $("#lang-display").textContent = data.langDisplay;
  document.documentElement.lang = currentLang;
}

function updateModalText() {
  const data = I18N_DATA[currentLang].modal;
  // modal-title HTML'den kaldırıldı ama yine de varsa gizleyeceğiz
  const mt = $("#modal-title");
  if (mt) mt.style.display = "none";
  $("#modal-subtitle").textContent = data.subtitle;
  $("#password-input").placeholder = data.placeholder;
  const btnTxt = document.querySelector(".btn-text");
  if (btnTxt) btnTxt.textContent = data.submit;
}

function updateMenuText() {
  const data = I18N_DATA[currentLang].menu;
  $("#hero-title").textContent = data.heroTitle;
  $("#hero-subtitle").textContent = data.heroSubtitle;
  $("#menu-title").textContent = data.menuTitle;
  $("#tts-title").textContent = data.tts.title;
  $("#tts-desc").textContent = data.tts.desc;
  $("#tts-btn").textContent = data.tts.btn;
  $("#clone-title").textContent = data.clone.title;
  $("#clone-desc").textContent = data.clone.desc;
  $("#clone-btn").textContent = data.clone.btn;
  $("#podcast-title").textContent = data.podcast.title;
  $("#podcast-desc").textContent = data.podcast.desc;
  $("#podcast-btn").textContent = data.podcast.btn;
  $("#stt-title").textContent = data.stt.title;
  $("#stt-desc").textContent = data.stt.desc;
  $("#stt-btn").textContent = data.stt.btn;
  const langDisplay = $("#lang-display-main");
  if (langDisplay) langDisplay.textContent = currentLang === "tr" ? "EN" : "TR";
}

function toggleLanguage() {
  currentLang = currentLang === "tr" ? "en" : "tr";
  state.currentLanguage = currentLang;
  localStorage.setItem(CONFIG.LS_LANG, currentLang);
  // intro + modal + main güncelle
  updateIntroText();
  updateModalText();
  updateMenuText();
}

function loadLanguagePreference() {
  const saved = localStorage.getItem(CONFIG.LS_LANG);
  if (saved && I18N_DATA[saved]) {
    currentLang = saved;
    state.currentLanguage = saved;
  } else {
    // ilk girişte EN yaz
    localStorage.setItem(CONFIG.LS_LANG, "en");
    currentLang = "en";
    state.currentLanguage = "en";
  }
  document.documentElement.lang = currentLang;
}

/* ========= INTRO ========= */

function ensureLoginHeading() {
  // Parola kutusunun ÜSTÜNDE görünen başlık bloğu
  let wrap = document.getElementById("login-heading");
  if (!wrap) {
    const modal = document.getElementById("login-modal");
    if (!modal) return;
    wrap = document.createElement("div");
    wrap.id = "login-heading";
    wrap.className = "login-heading";
    const html = `
      <h1 class="intro-title">SoundAurora</h1>
      <p class="intro-tagline">${I18N_DATA[currentLang].intro.tagline}</p>
      <p class="intro-small">${I18N_DATA[currentLang].intro.small}</p>
    `;
    wrap.innerHTML = html;
    const modalContent = modal.querySelector(".modal-content");
    modal.insertBefore(wrap, modalContent || modal.firstChild);
  } else {
    // dil değiştiyse metni güncelle
    wrap.querySelector(".intro-tagline").textContent = I18N_DATA[currentLang].intro.tagline;
    wrap.querySelector(".intro-small").textContent = I18N_DATA[currentLang].intro.small;
  }
  wrap.style.display = "block";

  // Kutudaki başlığı varsa gizle
  const mt = document.getElementById("modal-title");
  if (mt) mt.style.display = "none";
}

function showLoginModal() {
  if (state.loginCompleted || state.introCompleted) return;

  clearTimeout(introTimer);
  if (CONFIG.INTRO_SHOW_ONCE) localStorage.setItem(CONFIG.LS_INTRO, "1");

  const overlay = document.getElementById("intro-overlay");
  const modal = document.getElementById("login-modal");

  overlay.classList.add("fade-out");
  setTimeout(() => {
    overlay.style.display = "none";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    // ÜST BAŞLIK BLOĞUNU getir, kutu başlığını gizle
    ensureLoginHeading();
    updateModalText();

    const inp = document.getElementById("password-input");
    setTimeout(() => inp && inp.focus(), 120);
  }, 650);

  state.introCompleted = true;
}

function initIntro() {
  const overlay = document.getElementById("intro-overlay");
  const video = document.getElementById("intro-video");
  const skipBtn = document.getElementById("skip-intro");
  const langToggle = document.getElementById("lang-toggle-intro");

  // Daha önce gösterildiyse atla
  if (CONFIG.INTRO_SHOW_ONCE && localStorage.getItem(CONFIG.LS_INTRO)) {
    showLoginModal();
    return;
  }

  // Görünür yap
  overlay.style.display = "flex";

  // Video oynat (autoplay fallback)
  if (video && video.canPlayType("video/mp4")) {
    video.muted = true;
    video.playsInline = true;
    video.src = CONFIG.VIDEO_PATH + "?cb=" + Date.now(); // cache bypass
    video.load();
    video.play().catch(() => {
      // Autoplay engellenirse ilk tıklamada başlat
      const once = () => {
        video.play().catch(()=>{});
        document.removeEventListener("click", once, true);
      };
      document.addEventListener("click", once, true);
    });

    video.addEventListener("ended", showLoginModal, { once: true });
    video.addEventListener("error", showLoginModal, { once: true });
  }

  // Süre sınırlayıcı (fail-safe)
  introTimer = setTimeout(() => {
    if (!state.loginCompleted) showLoginModal();
  }, CONFIG.INTRO_DURATION_MS);

  // Skip
  skipBtn.addEventListener("click", () => {
    clearTimeout(introTimer);
    try { video.pause(); } catch {}
    showLoginModal();
  });

  // Dil butonu
  langToggle.addEventListener("click", () => {
    toggleLanguage();
  });

  // Intro metinleri
  updateIntroText();
}

/* ========= LOGIN ========= */

function initLoginForm() {
  const form = document.getElementById("login-form");
  const input = document.getElementById("password-input");
  const errorMessage = document.getElementById("error-message");
  const modal = document.getElementById("login-modal");

  updateModalText();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pw = (input.value || "").trim();

    if (pw === CONFIG.DEMO_PASSWORD) {
      errorMessage.classList.remove("show");
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        modal.style.display = "none";
        showMainContent();
      }, 350);
      state.loginCompleted = true;
    } else {
      errorMessage.textContent = I18N_DATA[currentLang].modal.error;
      errorMessage.classList.add("show");
      input.style.animation = "shake 0.5s";
      setTimeout(() => {
        input.style.animation = "";
        input.select();
      }, 500);
    }
  });

  input.addEventListener("input", () => errorMessage.classList.remove("show"));
}

function showMainContent() {
  const main = document.getElementById("main-content");
  main.style.display = "block";
  updateMenuText();

  const langToggleMain = document.getElementById("lang-toggle-main");
  langToggleMain.addEventListener("click", () => {
    toggleLanguage();
  });

  setTimeout(() => {
    main.style.opacity = "1";
    main.style.transform = "translateY(0)";
  }, 100);
}

/* ========= MENU PLACEHOLDERS ========= */

function initMenuHandlers() {
  document.querySelectorAll(".menu-card").forEach((card) => {
    const feature = card.dataset.feature;
    const btn = card.querySelector(".card-btn");

    const handler = (e) => {
      if (e) e.stopPropagation();
      handleFeatureClick(feature);
    };

    btn.addEventListener("click", handler);
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); }
    });
  });
}

function handleFeatureClick(feature) {
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
  const message = messages[currentLang][feature] || "Coming soon!";
  showNotification(message);
}

function showNotification(message) {
  const n = document.createElement("div");
  n.className = "notification";
  n.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
    color: var(--primary-black); padding: 1rem 2rem; border-radius: 12px; font-weight: 600;
    z-index: 3000; box-shadow: 0 10px 30px rgba(212,175,55,.4); opacity: 0; transition: opacity .3s;
  `;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(()=> n.style.opacity = "1", 10);
  setTimeout(()=> { n.style.opacity = "0"; setTimeout(()=> n.remove(), 300); }, 3000);
}

/* ========= INIT ========= */

function addShakeAnimation() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      10%,30%,50%,70%,90%{transform:translateX(-5px)}
      20%,40%,60%,80%{transform:translateX(5px)}
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
  loadLanguagePreference();     // EN varsayılan
  addShakeAnimation();

  initIntro();
  initLoginForm();
  initMenuHandlers();

  // Intro hiç başlamadıysa güvenlik için login'e düş
  setTimeout(() => {
    if (!state.introCompleted && !state.loginCompleted) showLoginModal();
  }, 1000);
});

// Sekme gizlenince video pause
document.addEventListener("visibilitychange", () => {
  const v = document.getElementById("intro-video");
  if (document.hidden && v && !v.paused) v.pause();
});
