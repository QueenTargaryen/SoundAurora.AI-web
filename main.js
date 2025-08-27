/* ========= SoundAurora - main.js (HTML/CSS'e dokunmadan) ========= */

// --- CONFIG ---
const CONFIG = {
  DEMO_PASSWORD: "quynh_demo_001",
  INTRO_SHOW_ONCE: true,
  INTRO_DURATION_MS: 10000,
  VIDEO_PATH: "assets/intro.mp4",
  LS_LANG: "preferredLang",
  LS_INTRO: "introSeen",
};

// --- I18N ---
const I18N = {
  en: {
    intro: {
      title: "SoundAurora",
      tagline: "Studio-quality voice, instantly with AI.",
      small: "TTS • STT • Voice Cloning • Podcast",
      skip: "Skip",
      opposite: "TR",
    },
    modal: {
      title: "SoundAurora",
      subtitle: "Enter the password to access the platform",
      placeholder: "Enter password...",
      submit: "Login",
      error: "Wrong password! Please try again.",
    },
    menu: {
      heroTitle: "Welcome to SoundAurora",
      heroSubtitle: "Voice cloning & podcast creation with AI",
      menuTitle: "Features",
      tts: { title: "Text to Speech", desc: "Turn your text into a pro voice file", btn: "Start" },
      clone:{ title: "Voice Cloning", desc:"Clone your own voice and use it",  btn:"Start" },
      podcast:{title:"Generate Podcast", desc:"Turn your script into an automatic podcast", btn:"Start"},
      stt:  { title:"Speech → Text", desc:"Transcribe your recordings into text", btn:"Start" },
    },
  },
  tr: {
    intro: {
      title: "SoundAurora",
      tagline: "Yapay zekâ ile hızlı, stüdyo kalitesinde ses.",
      small: "TTS • STT • Ses Klonlama • Podcast",
      skip: "Geç",
      opposite: "EN",
    },
    modal: {
      title: "SoundAurora",
      subtitle: "Platforma erişim için parolayı girin",
      placeholder: "Parola girin...",
      submit: "Giriş",
      error: "Parola hatalı. Lütfen tekrar deneyin.",
    },
    menu: {
      heroTitle: "SoundAurora'ya Hoş Geldiniz",
      heroSubtitle: "Yapay zeka ile ses klonlama ve podcast üretimi",
      menuTitle: "Özellikler",
      tts: { title: "Metinden Ses", desc: "Metninizi profesyonel ses dosyasına dönüştürün", btn: "Başla" },
      clone:{ title:"Ses Klonlama", desc:"Kendi sesinizi klonlayın ve kullanın", btn:"Başla" },
      podcast:{title:"Podcast Üret", desc:"Metninizi otomatik podcast'e çevirin", btn:"Başla"},
      stt:  { title:"Ses → Metin", desc:"Ses kayıtlarınızı metne dönüştürün", btn:"Başla" },
    },
  },
};

// --- STATE/HELPERS ---
let currentLang = localStorage.getItem(CONFIG.LS_LANG) || "en";
const $ = (s) => document.querySelector(s);
const show = (el) => el && (el.style.display = "");
const hide = (el) => el && (el.style.display = "none");
const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
const setPh   = (id, t) => { const el = document.getElementById(id); if (el && "placeholder" in el) el.placeholder = t; };

async function fileExists(url) {
  try {
    const r = await fetch(url, { method: "HEAD", cache: "no-store" });
    const size = +(r.headers.get("content-length") || 0);
    return r.ok && size > 0;
  } catch { return false; }
}

// --- I18N apply ---
function applyIntroTexts() {
  const t = I18N[currentLang].intro;
  setText("intro-title", t.title);
  setText("intro-tagline", t.tagline);
  setText("intro-small", t.small);
  setText("skip-text", t.skip);
  const disp = $("#lang-display"); if (disp) disp.textContent = t.opposite;
  document.documentElement.setAttribute("lang", currentLang);
}
function applyModalTexts() {
  const t = I18N[currentLang].modal;
  setText("modal-title", t.title);
  setText("modal-subtitle", t.subtitle);
  setPh("password-input", t.placeholder);
  const btnTxt = document.querySelector(".submit-btn .btn-text");
  if (btnTxt) btnTxt.textContent = t.submit;
}
function applyMainTexts() {
  const t = I18N[currentLang].menu;
  setText("hero-title", t.heroTitle);
  setText("hero-subtitle", t.heroSubtitle);
  setText("menu-title", t.menuTitle);
  setText("tts-title", t.tts.title); setText("tts-desc", t.tts.desc); setText("tts-btn", t.tts.btn);
  setText("clone-title", t.clone.title); setText("clone-desc", t.clone.desc); setText("clone-btn", t.clone.btn);
  setText("podcast-title", t.podcast.title); setText("podcast-desc", t.podcast.desc); setText("podcast-btn", t.podcast.btn);
  setText("stt-title", t.stt.title); setText("stt-desc", t.stt.desc); setText("stt-btn", t.stt.btn);
  const disp = $("#lang-display-main"); if (disp) disp.textContent = I18N[currentLang].intro.opposite;
  document.documentElement.setAttribute("lang", currentLang);
}

// --- Language toggle ---
function toggleLang() {
  currentLang = (currentLang === "en") ? "tr" : "en";
  localStorage.setItem(CONFIG.LS_LANG, currentLang);
  // Güncel ekranda ne görünüyorsa onu çevir
  if ($("#intro-overlay") && $("#intro-overlay").style.display !== "none") {
    applyIntroTexts();
  }
  applyModalTexts();
  applyMainTexts();
}

// --- Intro flow ---
let introTimer = null;
function goLogin(markSeen) {
  if (markSeen && CONFIG.INTRO_SHOW_ONCE) localStorage.setItem(CONFIG.LS_INTRO, "1");
  const overlay = $("#intro-overlay");
  const modal = $("#login-modal");
  overlay && overlay.classList.add("fade-out");
  setTimeout(() => {
    hide(overlay);
    modal && modal.classList.add("show");
    modal && modal.setAttribute("aria-hidden", "false");
    const inp = $("#password-input");
    setTimeout(() => inp && inp.focus(), 100);
  }, 600);
}

async function runIntro() {
  const overlay = $("#intro-overlay");
  const video   = $("#intro-video");
  const skipBtn = $("#skip-intro");
  const langBtn = $("#lang-toggle-intro");

  applyIntroTexts();

  // Daha önce gerçekten izlendiyse atla
  if (CONFIG.INTRO_SHOW_ONCE && localStorage.getItem(CONFIG.LS_INTRO) === "1") {
    goLogin(false);
    return;
  }

  // Video var mı?
  const hasVideo = await fileExists(CONFIG.VIDEO_PATH);
  if (!hasVideo) { // hiç pıt yapmadan modala geç
    hide(overlay);
    goLogin(false);
    return;
  }

  // Intro göster
  show(overlay);

  // autoplay
  if (video && video.canPlayType("video/mp4")) {
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("canplay", () => { video.play().catch(()=>{}); }, { once:true });
    video.addEventListener("ended", () => goLogin(true), { once:true });
    video.addEventListener("error", () => goLogin(false), { once:true });
  }

  // failsafe süre
  introTimer = setTimeout(() => goLogin(true), CONFIG.INTRO_DURATION_MS);

  // Skip
  if (skipBtn) skipBtn.addEventListener("click", (e) => {
    e.preventDefault();
    try { video && video.pause(); } catch {}
    clearTimeout(introTimer);
    goLogin(true);
  });

  // Dil butonu
  if (langBtn) langBtn.addEventListener("click", toggleLang);
}

// --- Login flow ---
function runLogin() {
  applyModalTexts();
  const form = $("#login-form");
  const inp  = $("#password-input");
  const err  = $("#error-message");
  const modal = $("#login-modal");
  const main  = $("#main-content");

  form && form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (inp?.value || "").trim();
    if (val === CONFIG.DEMO_PASSWORD) {
      err && (err.textContent = "");
      hide(modal);
      show(main);
    } else {
      err && (err.textContent = I18N[currentLang].modal.error);
    }
  });
}

// --- Main menu placeholders ---
function wireMenu() {
  const msg = {
    tr: { tts:"Metinden ses özelliği yakında!", clone:"Ses klonlama yakında!", podcast:"Podcast üretimi yakında!", stt:"Ses→Metin yakında!" },
    en: { tts:"Text-to-speech coming soon!", clone:"Voice cloning coming soon!", podcast:"Podcast generation coming soon!", stt:"Speech-to-text coming soon!" }
  };
  document.querySelectorAll(".menu-card").forEach(card => {
    const f = card.dataset.feature;
    const handler = (e)=>{ e && e.stopPropagation(); alert(msg[currentLang][f] || "Coming soon!"); };
    card.addEventListener("click", handler);
    card.querySelector(".card-btn")?.addEventListener("click", handler);
  });
}

// --- Language button in header ---
function wireHeaderLang() {
  $("#lang-toggle-main")?.addEventListener("click", toggleLang);
}

// --- Init ---
document.addEventListener("DOMContentLoaded", async () => {
  // Açılış dili: EN (ilk kez giren için)
  if (!localStorage.getItem(CONFIG.LS_LANG)) {
    localStorage.setItem(CONFIG.LS_LANG, "en");
    currentLang = "en";
  }

  await runIntro();
  runLogin();
  applyMainTexts();
  wireHeaderLang();
  wireMenu();

  // Sekme gizlenince video pause
  document.addEventListener("visibilitychange", () => {
    const v = $("#intro-video");
    if (document.hidden && v && !v.paused) v.pause();
  });
});
/* ===== SA PATCH: Çift aşamalı intro (append at EOF) ===== */
(() => {
  if (window.__SA_CHAINED_INTRO__) return; window.__SA_CHAINED_INTRO__ = true;

  const PATHS = {
    USER:  'assets/intro.mp4',        // 1. video (senin)
    CLOUD: 'assets/intro_cloud.mp4'   // 2. video (opsiyonel)
  };
  const DUR = { USER_MS: 10000, CLOUD_MS: 7000 }; // süre sınırlayıcı (ms)
  const LS  = { SEEN: 'introSeen', LANG: 'preferredLang' };

  const $ = (s)=>document.querySelector(s);
  const hide = (el)=>el && (el.style.display='none');
  const show = (el)=>el && (el.style.display='');
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

  async function exists(url){
    try{
      const r = await fetch(`${url}?cb=${Date.now()}`, { method:'HEAD', cache:'no-store' });
      const sz = +(r.headers.get('content-length') || 0);
      return r.ok && sz > 0;
    }catch{ return false; }
  }

  function goLogin(markSeen=true){
    if (markSeen) localStorage.setItem(LS.SEEN,'1');
    const overlay = $('#intro-overlay');
    const modal   = $('#login-modal');
    const main    = $('#main-content');
    hide(overlay);
    show(modal); modal?.setAttribute('aria-hidden','false');
    hide(main);
  }

  async function playClip(videoEl, src, maxMs){
    return new Promise(async (resolve)=>{
      let done=false, timer=null;

      const onEnd = ()=>{ if(done) return; done=true; clearTimeout(timer); resolve(true); };
      const onErr = ()=>{ if(done) return; done=true; clearTimeout(timer); resolve(false); };

      videoEl.src = `${src}?cb=${Date.now()}`;
      try{
        videoEl.muted = true;
        videoEl.playsInline = true;
        await videoEl.play();
      }catch{
        // otoplay engellenirse ilk tıklamada başlat
        const once=()=>{ videoEl.play().catch(()=>{}); document.removeEventListener('click',once,true); };
        document.addEventListener('click',once,true);
      }

      videoEl.onended = onEnd;
      videoEl.onerror = onErr;

      // güvenlik için süre sınırı
      timer = setTimeout(onEnd, maxMs);
    });
  }

  async function runChainedIntro(){
    // 1) Daha önce izlendiyse direkt parola
    if (localStorage.getItem(LS.SEEN) === '1'){ goLogin(false); return; }

    // 2) Elemanlar
    const overlay = $('#intro-overlay');
    const video   = $('#intro-video');
    const skipBtn = $('#skip-intro');
    if (!overlay || !video){ goLogin(false); return; }

    show(overlay);

    // Skip: anında parola
    skipBtn?.addEventListener('click', (e)=>{
      e.preventDefault();
      try{ video.pause(); }catch{}
      goLogin(true);
    });

    // 3) Kullanıcı videosu var mı?
    const hasUser  = await exists(PATHS.USER);
    const hasCloud = await exists(PATHS.CLOUD); // yoksa yazı bekletmesi yapacağız

    if (hasUser){
      const ok = await playClip(video, PATHS.USER, DUR.USER_MS);
      // ok olmasa da devam ediyoruz
    }

    // 4) Cloud aşaması: video varsa oynat, yoksa yazıyı beklet
    if (hasCloud){
      await playClip(video, PATHS.CLOUD, DUR.CLOUD_MS);
    }else{
      // video yoksa: yazı/animasyon zaten overlay'de görünüyor → sadece beklet
      await sleep(DUR.CLOUD_MS);
    }

    // 5) Son: parola ekranı
    goLogin(true);
  }

  // Varsayılan dili EN bir kere ayarla; dil butonları mevcut kodunla çalışmaya devam eder
  document.addEventListener('DOMContentLoaded', ()=>{
    if (!localStorage.getItem(LS.LANG)) localStorage.setItem(LS.LANG,'en');
    runChainedIntro();
  });
})();

