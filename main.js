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
            tagline: "Professional studio voice, now in your hands with AI power.",
            subtitle: "TTS • STT • Voice Clone • Podcast • E-Book • VPS",
            title: "Platform Access",
            desc: "Enter password to access platform",
            placeholder: "Enter your password...", 
            button: "Login",
            error: "Wrong password! Please try again."
        },
        main: {
            heroTitle: "SoundAurora'ya Hoş Geldiniz",
            heroDesc: "Yapay zeka destekli ses klonlama ve podcast platformu tamamen ücretsizdir ve şu anda BETA aşamasındadır.",
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
            heroDesc: "AI-powered voice cloning and podcast platform is completely free and currently in BETA stage.",
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

// --- TTS gender support ---
let selectedGender = 'female'; // default
// Sunucu /api/voices cevabında gender yoksa isimden tahmin için ipucu tablosu:
const VOICE_GENDER_HINTS = {
  // örnek id/name kırpımları → 'female' | 'male'
  'female': ['female','woman','salli','hazel','zoe','aria','jenny','emma','natasha','susan'],
  'male':   ['male','man','tom','guy','daniel','matthew','george','al','adam','guy','tolga']
};
function guessGenderByName(name='') {
  const n = name.toLowerCase();
  if (VOICE_GENDER_HINTS.female.some(k=>n.includes(k))) return 'female';
  if (VOICE_GENDER_HINTS.male.some(k=>n.includes(k))) return 'male';
  return 'unknown';
}

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
    initTTS();
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

    // İSTEĞE BAĞLI: UI dili değişince voice listesini tazele
    if (typeof loadVoicesForLanguage === 'function') loadVoicesForLanguage();
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
    
    // Login hero texts
    const loginHeroTagline = document.getElementById('loginHeroTagline');
    const loginHeroSubtitle = document.getElementById('loginHeroSubtitle');
    
    if (loginHeroTagline && loginHeroSubtitle) {
        loginHeroTagline.textContent = data.intro.tagline;
        loginHeroSubtitle.textContent = data.intro.subtitle;
    }
    
    // Login texts
    const loginTitle = document.getElementById('loginTitle');
    const loginDesc = document.getElementById('loginDesc');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginTitle && loginDesc && loginBtn) {
        loginTitle.textContent = data.login.title;
        loginDesc.textContent = data.login.desc;
        if (passwordInput) passwordInput.placeholder = data.login.placeholder;
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

    // Footer i18n (license notice)
    const lp = document.getElementById('licensePrefix');
    const ld = document.getElementById('licenseDetails');
    const tt = document.getElementById('tooltipTitle');

    if (lp && ld && tt) {
      if (currentLang === 'tr') {
        lp.textContent = '🔊 Tüm sesler lisans gerektirmez —';
        ld.textContent = 'Detaylar';
        tt.textContent = 'Kullanılan Açık Kaynak Projeler ve Model Lisansları:';
      } else {
        lp.textContent = '🔊 All voices are license-free —';
        ld.textContent = 'Details';
        tt.textContent = 'Open-source Projects & Model Licenses:';
      }
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
            skipBtn.style.display = 'flex';
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
    if (feature === 'tts') { showTTSPage(); return; }
    console.log('handleFeatureClick called with:', feature);
    
    const messages = {
        tr: {
            stt: "Ses → Metin özelliği yakında gelecek!",
            clone: "Ses Klonlama özelliği yakında gelecek!",
            podcast: "Podcast Üretimi özelliği yakında gelecek!",
            aibook: "AI Book özelliği yakında gelecek!",
            soon: "Bu özellik çok yakında gelecek!"
        },
        en: {
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

// TTS Variables
let ttsSection, ttsElements = {};
let availableVoices = [];
let currentAudioBlob = null;

// TTS Functions
function initTTS() {
    console.log('initTTS called');
    
    // Get TTS elements
    ttsSection = document.getElementById('tts');
    console.log('ttsSection found:', ttsSection);
    
    ttsElements = {
        backBtn: document.getElementById('backBtn'),
        textInput: document.getElementById('textInput'),
        charCount: document.getElementById('charCount'),
        langSelect: document.getElementById('langSelect'),
        voiceSelect: document.getElementById('voiceSelect'),
        styleSelect: document.getElementById('styleSelect'),
        speedRange: document.getElementById('speedRange'),
        speedValue: document.getElementById('speedValue'),
        generateBtn: document.getElementById('generateBtn'),
        generateText: document.getElementById('generateText'),
        spinner: document.getElementById('spinner'),
        audioResult: document.getElementById('audioResult'),
        audioPlayer: document.getElementById('audioPlayer'),
        downloadBtn: document.getElementById('downloadBtn'),
        playAgainBtn: document.getElementById('playAgainBtn'),
        errorMessage: document.getElementById('errorMessage'),
        genderGroup: document.getElementById('ttsGenderGroup'),
        genderFemaleBtn: document.getElementById('genderFemale'),
        genderMaleBtn: document.getElementById('genderMale'),
        voiceSelect: document.getElementById('ttsVoice')
    };

    // Initialize TTS event listeners
    if (ttsElements.backBtn) {
        ttsElements.backBtn.addEventListener('click', () => {
            showMainMenu();
        });
    }

    if (ttsElements.textInput) {
        ttsElements.textInput.addEventListener('input', updateCharCount);
    }

    if (ttsElements.speedRange) {
        ttsElements.speedRange.addEventListener('input', (e) => {
            if (ttsElements.speedValue) {
                ttsElements.speedValue.textContent = e.target.value;
            }
        });
    }

    if (ttsElements.langSelect) {
        ttsElements.langSelect.addEventListener('change', loadVoicesForLanguage);
    }

    if (ttsElements.generateBtn) {
        ttsElements.generateBtn.addEventListener('click', generateTTS);
    }

    if (ttsElements.downloadBtn) {
        ttsElements.downloadBtn.addEventListener('click', downloadAudio);
    }

    if (ttsElements.playAgainBtn) {
        ttsElements.playAgainBtn.addEventListener('click', playAudioAgain);
    }

    // Gender selection event listeners
    if (ttsElements.genderFemaleBtn && ttsElements.genderMaleBtn) {
      const onGenderClick = (g) => {
        selectedGender = g;                      // state güncelle
        // buton aktiflikleri
        ttsElements.genderFemaleBtn.classList.toggle('active', g==='female');
        ttsElements.genderMaleBtn.classList.toggle('active', g==='male');
        // Voice listesini yeniden yükle/filtrele
        populateVoiceSelect();
      };
      ttsElements.genderFemaleBtn.addEventListener('click', ()=> onGenderClick('female'));
      ttsElements.genderMaleBtn.addEventListener('click',   ()=> onGenderClick('male'));
    }

    // Load initial voices
    loadVoicesForLanguage();
}

async function loadVoicesForLanguage() {
  if (!ttsElements.voiceSelect) return;

  const selectedLang = (typeof currentLang !== 'undefined' ? currentLang : 'en');
  ttsElements.voiceSelect.innerHTML = '<option value="">Loading voices...</option>';
  availableVoices = [];

  // 1) Sunucu sesleri
  try {
    const res = await fetch('/api/voices');
    if (res.ok) {
      const serverVoices = await res.json(); // {id, name, language, ...[gender?]}
      serverVoices.forEach(v => {
        if (!v.language) return;
        if (v.language.toLowerCase().startsWith(selectedLang.toLowerCase())) {
          availableVoices.push({
            id: v.id,
            name: v.name,
            language: v.language,
            gender: v.gender || guessGenderByName(v.name),
            engine: 'server'
          });
        }
      });
    }
  } catch(e) {
    console.log('Server voices not available:', e);
  }

  // 2) Tarayıcı fallback sesleri (isteğe bağlı)
  try {
    const browserVoices = speechSynthesis.getVoices();
    browserVoices.forEach(bv => {
      const lang = (bv.lang || '').toLowerCase();
      const ok =
        (selectedLang === 'tr' && lang.includes('tr')) ||
        (selectedLang === 'en' && lang.includes('en'));
      if (ok) {
        availableVoices.push({
          id: bv.name,
          name: `${bv.name} (Browser)`,
          language: selectedLang,
          gender: guessGenderByName(bv.name),
          engine: 'browser',
          browserVoice: bv
        });
      }
    });
  } catch(e) {
    console.log('Browser voices load error:', e);
  }

  // 3) UI'yi güncelle
  populateVoiceSelect();
}

function populateVoiceSelect() {
  if (!ttsElements.voiceSelect) return;

  // Filtre: seçili cinsiyet
  const filtered = availableVoices.filter(v => {
    if (!selectedGender || selectedGender==='unknown') return true;
    return (v.gender || 'unknown') === selectedGender;
  });

  // Hiç yoksa "No voices" göster
  if (!filtered.length) {
    ttsElements.voiceSelect.innerHTML = '<option value="">No voices available for this gender</option>';
    return;
  }

  // Doldur
  ttsElements.voiceSelect.innerHTML = '';
  filtered.forEach(v => {
    const o = document.createElement('option');
    o.value = v.id;
    o.textContent = v.name;
    ttsElements.voiceSelect.appendChild(o);
  });

  // Varsayılanı ilk elemana ata
  ttsElements.voiceSelect.value = filtered[0].id;
}

function showTTSPage() {
    console.log('showTTSPage called');
    console.log('mainContent:', mainContent);
    console.log('ttsSection:', ttsSection);
    
    if (mainContent) {
        mainContent.style.display = 'none';
        console.log('mainContent hidden');
    }
    if (ttsSection) {
        ttsSection.style.display = 'block';
        console.log('ttsSection shown');
    } else {
        console.error('ttsSection not found!');
    }
    
    // Reset form
    if (ttsElements.textInput) ttsElements.textInput.value = '';
    if (ttsElements.audioResult) ttsElements.audioResult.style.display = 'none';
    if (ttsElements.errorMessage) ttsElements.errorMessage.style.display = 'none';
    updateCharCount();
}

function showMainMenu() {
    if (ttsSection) ttsSection.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
}

function updateCharCount() {
    if (ttsElements.textInput && ttsElements.charCount) {
        const count = ttsElements.textInput.value.length;
        ttsElements.charCount.textContent = count;
        
        if (count > 450) {
            ttsElements.charCount.style.color = '#ff6b6b';
        } else if (count > 350) {
            ttsElements.charCount.style.color = '#ffa500';
        } else {
            ttsElements.charCount.style.color = 'var(--text-secondary)';
        }
    }
}

async function generateTTS() {
    if (!ttsElements.textInput || !ttsElements.textInput.value.trim()) {
        showError('Please enter some text to convert.');
        return;
    }

    const formData = {
        text: ttsElements.textInput.value.trim(),
        lang: ttsElements.langSelect.value,
        voice_id: ttsElements.voiceSelect.value,
        style: ttsElements.styleSelect.value,
        speed: parseFloat(ttsElements.speedRange.value)
    };

    setLoadingState(true);
    hideError();

    try {
        const selectedVoice = availableVoices.find(v => v.id === formData.voice_id);
        
        if (selectedVoice && selectedVoice.browserVoice) {
            await generateWithBrowserTTS(formData);
        } else {
            await generateWithServerTTS(formData);
        }
    } catch (error) {
        console.error('TTS Error:', error);
        showError('Failed to generate audio. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

async function generateWithServerTTS(formData) {
    try {
        const response = await fetch('/api/tts/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Server TTS failed, trying browser fallback');
        }

        const blob = await response.blob();
        currentAudioBlob = blob;
        
        const audioUrl = URL.createObjectURL(blob);
        ttsElements.audioPlayer.src = audioUrl;
        ttsElements.audioResult.style.display = 'block';
        
        // Auto-play the generated audio
        await ttsElements.audioPlayer.play();
        
    } catch (error) {
        console.log('Server TTS failed, using browser fallback');
        await generateWithBrowserTTS(formData);
    }
}

async function generateWithBrowserTTS(formData) {
    if (!window.speechSynthesis) {
        throw new Error('Speech synthesis not supported in this browser');
    }

    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(formData.text);
        
        // Find the browser voice
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === formData.voice_id);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = formData.lang === 'tr' ? 'tr-TR' : 'en-US';
        }
        
        utterance.rate = formData.speed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
            ttsElements.audioResult.style.display = 'block';
            resolve();
        };

        utterance.onerror = (event) => {
            reject(new Error('Browser TTS failed: ' + event.error));
        };

        window.speechSynthesis.speak(utterance);
    });
}

function setLoadingState(isLoading) {
    if (ttsElements.generateBtn && ttsElements.generateText && ttsElements.spinner) {
        ttsElements.generateBtn.disabled = isLoading;
        ttsElements.generateText.style.display = isLoading ? 'none' : 'inline';
        ttsElements.spinner.style.display = isLoading ? 'inline-block' : 'none';
    }
}

function showError(message) {
    if (ttsElements.errorMessage) {
        ttsElements.errorMessage.textContent = message;
        ttsElements.errorMessage.style.display = 'block';
    }
}

function hideError() {
    if (ttsElements.errorMessage) {
        ttsElements.errorMessage.style.display = 'none';
    }
}

function downloadAudio() {
    if (currentAudioBlob) {
        const url = URL.createObjectURL(currentAudioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'soundaurora_tts_' + Date.now() + '.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        showError('No audio available for download');
    }
}

function playAudioAgain() {
    if (ttsElements.audioPlayer && ttsElements.audioPlayer.src) {
        ttsElements.audioPlayer.currentTime = 0;
        ttsElements.audioPlayer.play();
    }
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

// #TTS_MINIMAL_HELPERS (conflict-safe - farklı isimler)
let __ttsSec=null, __ttsEls=null;

function __ttsInitOnce(){
  if (__ttsSec) return;
  __ttsSec = document.getElementById('ttsSection');
  if (!__ttsSec) return;

  __ttsEls = {
    text:  document.getElementById('ttsText'),
    voice: document.getElementById('ttsVoice'),
    rate:  document.getElementById('ttsRate'),
    play:  document.getElementById('ttsPlay'),
    stop:  document.getElementById('ttsStop'),
    back:  document.getElementById('ttsBack'),
  };

  // Voice listesi – tarayıcı TTS
  if ('speechSynthesis' in window && __ttsEls.voice){
    function loadVoices(){
      const vs = speechSynthesis.getVoices()
        .sort((a,b)=>a.lang.localeCompare(b.lang)||a.name.localeCompare(b.name));
      __ttsEls.voice.innerHTML='';
      vs.forEach(v=>{
        const o=document.createElement('option');
        o.value=v.name; o.textContent=`${v.name} (${v.lang})`;
        __ttsEls.voice.appendChild(o);
      });
    }
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Butonlar
  __ttsEls.play?.addEventListener('click', __ttsPlayBrowser);
  __ttsEls.stop?.addEventListener('click', ()=>window.speechSynthesis?.cancel());
  __ttsEls.back?.addEventListener('click', hideTTSPage);
}

// TTS sayfasını aç/kapat — ana içeriği değil, sadece "features"ı gizle
function showTTSPage(){
  __ttsInitOnce();
  if (!__ttsSec) { console.error('TTS section not found'); return; }

  // Ana içerik açık kalsın
  if (typeof mainContent !== 'undefined' && mainContent) {
    mainContent.style.display = 'block';
    mainContent.classList.add('show');
  }

  // Sadece özellikler gridini gizle
  const features = document.getElementById('featuresSection') || document.querySelector('.features');
  if (features) features.style.display = 'none';

  // TTS bölümünü göster
  __ttsSec.classList.add('show');
  __ttsSec.style.display = 'block';

  // İlk kez ses listesini dolduralım
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices();
    if (!__ttsEls.voice?.options?.length && voices.length) {
      __ttsEls.voice.innerHTML = '';
      voices.sort((a,b)=>a.lang.localeCompare(b.lang)||a.name.localeCompare(b.name))
            .forEach(v=>{
              const o=document.createElement('option');
              o.value=v.name; o.textContent=`${v.name} (${v.lang})`;
              __ttsEls.voice.appendChild(o);
            });
    }
  }
}

function hideTTSPage(){
  // TTS bölümünü gizle
  if (__ttsSec){ __ttsSec.classList.remove('show'); __ttsSec.style.display='none'; }

  // Özellikler gridini geri aç
  const features = document.getElementById('featuresSection') || document.querySelector('.features');
  if (features) features.style.display = 'block';

  // Ana içerik zaten açık kalsın
  if (typeof mainContent !== 'undefined' && mainContent) {
    mainContent.style.display = 'block';
    setTimeout(()=>mainContent.classList.add('show'), 50);
  }
}

function __ttsPlayBrowser(){
  const txt = __ttsEls?.text?.value?.trim();
  if (!txt || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt);
  const vs = speechSynthesis.getVoices();
  const chosen = vs.find(v=>v.name===__ttsEls.voice?.value);
  if (chosen) u.voice = chosen;
  u.rate = parseFloat(__ttsEls.rate?.value||'1');
  speechSynthesis.speak(u);
}