// 페이지 및 말풍선 관리
let currentPage = 0;

const TEXT_LINE_INTERVAL_MS = 2000;
const TEXT_HOLD_MS = 15000;

// 화면 전환 관리
const ScreenManager = {
    currentScreen: 'demo-screen',
    screenHistory: ['demo-screen'],
    
    show(screenId, options = {}) {
        document.querySelectorAll('.phone-screen-inner').forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            if (!options.skipHistory) {
                this.screenHistory.push(screenId);
            }
            this.currentScreen = screenId;
        }

        try {
            localStorage.setItem('activeScreen', this.currentScreen);
        } catch (e) {
            // ignore storage errors
        }
        
        // 화면 전환 시 말풍선 업데이트
        this.updateBalloons();
        updateInfoGifVisibility(this.currentScreen);
        updateQnaVideoVisibility(this.currentScreen);
        updateMainVideoVisibility(this.currentScreen);
        updateSurveyVideoVisibility(this.currentScreen);
        updateAdminPanelContent();
    },
    
    // 화면별 말풍선 업데이트
    updateBalloons() {
        // 모든 말풍선 숨김
        hideAllBalloons();
        
        // 현재 화면에 맞는 말풍선 표시
        const balloonContainer = document.getElementById('balloon-container');
        if (balloonContainer) {
            balloonContainer.style.display = this.currentScreen === 'demo-screen' ? 'none' : 'flex';
        }

        if (this.currentScreen === 'demo-screen') {
            return;
        } else {
            const mainBalloon1 = document.getElementById('balloon-main-1');
            const mainBalloon2 = document.getElementById('balloon-main-2');
            if (mainBalloon1) mainBalloon1.style.display = 'none';
            if (mainBalloon2) mainBalloon2.style.display = 'none';
            // 각 화면별 말풍선 ID 매핑
            const balloonMap = {
                'info-screen': 'balloon-info',
                'qna-screen': 'balloon-qna',
                'survey-screen': 'balloon-survey',
                'lottery-screen': 'balloon-lottery'
            };
            
            const balloonId = balloonMap[this.currentScreen];
            if (balloonId) {
                const balloon = document.getElementById(balloonId);
                if (balloon) {
                    balloon.style.display = 'flex';
                }
            }
        }
    },
    
    // 뒤로가기
    goBack() {
        if (this.currentScreen === 'qna-question-screen') {
            if (this.screenHistory.length > 0) {
                this.screenHistory[this.screenHistory.length - 1] = 'qna-screen';
            }
            this.show('qna-screen', { skipHistory: true });
            return;
        }
        if (this.screenHistory.length > 1) {
            this.screenHistory.pop(); // 현재 화면 제거
            const previousScreen = this.screenHistory[this.screenHistory.length - 1];
            this.show(previousScreen, { skipHistory: true });
        }
    },
    
    // 페이지 설정
    setPage(page) {
        currentPage = page;
        
        // 페이지 2 이상일 때 헤더 버튼 표시
        const headerRight = document.getElementById('header-right');
        if (headerRight) {
            headerRight.style.display = page >= 2 ? 'flex' : 'none';
        }
    },
    
    // 스크린에 콘텐츠 표시
    updateScreen(content) {
        const screenContent = document.getElementById('screen-content');
        if (screenContent) {
            screenContent.innerHTML = content;
        }
    }
};

function updateInfoGifVisibility(screenId) {
    const gifWrapper = document.getElementById('info-gif');
    if (!gifWrapper) return;

    const shouldShow = screenId === 'info-screen';
    gifWrapper.classList.toggle('is-visible', shouldShow);
    if (shouldShow) {
        playInfoGif();
        scheduleInfoGifOverlay();
    } else if (gifWrapper.dataset.timerId) {
        clearTimeout(parseInt(gifWrapper.dataset.timerId, 10));
        gifWrapper.dataset.timerId = '';
        if (gifWrapper.dataset.overlayTimerId) {
            clearTimeout(parseInt(gifWrapper.dataset.overlayTimerId, 10));
            gifWrapper.dataset.overlayTimerId = '';
        }
        gifWrapper.classList.remove('is-dimmed');
    }
}

function updateQnaVideoVisibility(screenId) {
    const videoWrapper = document.getElementById('qna-video');
    if (!videoWrapper) return;

    const shouldShow = screenId === 'qna-screen' || screenId === 'qna-question-screen';
    videoWrapper.classList.toggle('is-visible', shouldShow);

    const video = videoWrapper.querySelector('video');
    if (!video) return;

    if (shouldShow) {
        if (!updateQnaVideoVisibility.wasActive) {
            video.currentTime = 0;
            scheduleQnaVideoOverlay();
        }
        updateQnaVideoVisibility.wasActive = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    } else if (updateQnaVideoVisibility.wasActive) {
        video.pause();
        video.currentTime = 0;
        updateQnaVideoVisibility.wasActive = false;
        resetQnaVideoOverlay();
    }
}

updateQnaVideoVisibility.wasActive = false;

function updateMainVideoVisibility(screenId) {
    const videoWrapper = document.getElementById('main-video');
    if (!videoWrapper) return;

    const shouldShow = screenId === 'demo-screen';
    videoWrapper.classList.toggle('is-visible', shouldShow);

    const video = videoWrapper.querySelector('video');
    if (!video) return;

    if (shouldShow) {
        if (!updateMainVideoVisibility.wasActive) {
            video.currentTime = 0;
            scheduleMainVideoOverlay();
        }
        updateMainVideoVisibility.wasActive = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    } else if (updateMainVideoVisibility.wasActive) {
        video.pause();
        video.currentTime = 0;
        updateMainVideoVisibility.wasActive = false;
        resetMainVideoOverlay();
    }
}

updateMainVideoVisibility.wasActive = false;

function scheduleMainVideoOverlay() {
    const videoWrapper = document.getElementById('main-video');
    if (!videoWrapper) return;

    const delay = parseInt(videoWrapper.dataset.overlayDelay || '4000', 10);
    if (videoWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.overlayTimerId, 10));
    }
    if (videoWrapper.dataset.fadeTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.fadeTimerId, 10));
    }

    videoWrapper.classList.remove('is-dimmed');
    resetMainVideoTyping();
    const timerId = setTimeout(() => {
        videoWrapper.classList.add('is-dimmed');
        startMainVideoTyping();
        const totalDuration = getMainVideoTypingDuration() + TEXT_HOLD_MS;
        const fadeTimerId = setTimeout(() => {
            videoWrapper.classList.remove('is-dimmed');
            resetMainVideoTyping();
        }, Math.max(0, totalDuration));
        videoWrapper.dataset.fadeTimerId = String(fadeTimerId);
    }, Math.max(0, delay));

    videoWrapper.dataset.overlayTimerId = String(timerId);
}

function resetMainVideoOverlay() {
    const videoWrapper = document.getElementById('main-video');
    if (!videoWrapper) return;

    if (videoWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.overlayTimerId, 10));
        videoWrapper.dataset.overlayTimerId = '';
    }
    if (videoWrapper.dataset.fadeTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.fadeTimerId, 10));
        videoWrapper.dataset.fadeTimerId = '';
    }
    videoWrapper.classList.remove('is-dimmed');
    resetMainVideoTyping();
}

function resetMainVideoTyping() {
    const overlay = document.querySelector('#main-video .main-video-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-typing');
    const lines = overlay.querySelectorAll('.main-video-line');
    lines.forEach(line => {
        line.style.animationDelay = '0ms';
    });
}

function startMainVideoTyping() {
    const overlay = document.querySelector('#main-video .main-video-overlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.main-video-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * TEXT_LINE_INTERVAL_MS}ms`;
    });
    overlay.classList.add('is-typing');
}

function getMainVideoTypingDuration() {
    const overlay = document.querySelector('#main-video .main-video-overlay');
    if (!overlay) return 0;
    const lineCount = overlay.querySelectorAll('.main-video-line').length;
    if (lineCount === 0) return 0;
    return (lineCount - 1) * TEXT_LINE_INTERVAL_MS + 800;
}

function initMainVideoPlayback() {
    const videoWrapper = document.getElementById('main-video');
    const video = videoWrapper?.querySelector('video');
    if (!videoWrapper || !video) return;

    video.playbackRate = 1.5;
    video.loop = false;
    video.addEventListener('ended', () => {
        if (!updateMainVideoVisibility.wasActive) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
        scheduleMainVideoOverlay();
    });
}

function updateSurveyVideoVisibility(screenId) {
    const videoWrapper = document.getElementById('survey-video');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('video');
    const shouldShow = screenId === 'survey-screen';
    videoWrapper.classList.toggle('is-visible', shouldShow);

    if (shouldShow) {
        if (!updateSurveyVideoVisibility.wasActive) {
            video.currentTime = 0;
            scheduleSurveyVideoOverlay();
        }
        updateSurveyVideoVisibility.wasActive = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    } else if (updateSurveyVideoVisibility.wasActive) {
        video.pause();
        video.currentTime = 0;
        updateSurveyVideoVisibility.wasActive = false;
        resetSurveyVideoOverlay();
    }
}

updateSurveyVideoVisibility.wasActive = false;

function scheduleSurveyVideoOverlay() {
    const videoWrapper = document.getElementById('survey-video');
    if (!videoWrapper) return;

    const delay = parseInt(videoWrapper.dataset.overlayDelay || '4000', 10);
    if (videoWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.overlayTimerId, 10));
    }
    if (videoWrapper.dataset.fadeTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.fadeTimerId, 10));
    }

    videoWrapper.classList.remove('is-dimmed');
    resetSurveyVideoTyping();
    const timerId = setTimeout(() => {
        videoWrapper.classList.add('is-dimmed');
        startSurveyVideoTyping();
        const totalDuration = getSurveyVideoTypingDuration() + TEXT_HOLD_MS;
        const fadeTimerId = setTimeout(() => {
            videoWrapper.classList.remove('is-dimmed');
            resetSurveyVideoTyping();
        }, Math.max(0, totalDuration));
        videoWrapper.dataset.fadeTimerId = String(fadeTimerId);
    }, Math.max(0, delay));

    videoWrapper.dataset.overlayTimerId = String(timerId);
}

function resetSurveyVideoOverlay() {
    const videoWrapper = document.getElementById('survey-video');
    if (!videoWrapper) return;

    if (videoWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.overlayTimerId, 10));
        videoWrapper.dataset.overlayTimerId = '';
    }
    if (videoWrapper.dataset.fadeTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.fadeTimerId, 10));
        videoWrapper.dataset.fadeTimerId = '';
    }
    videoWrapper.classList.remove('is-dimmed');
    resetSurveyVideoTyping();
}

function resetSurveyVideoTyping() {
    const overlay = document.querySelector('#survey-video .survey-video-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-typing');
    const lines = overlay.querySelectorAll('.survey-video-line');
    lines.forEach(line => {
        line.style.animationDelay = '0ms';
    });
}

function startSurveyVideoTyping() {
    const overlay = document.querySelector('#survey-video .survey-video-overlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.survey-video-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * TEXT_LINE_INTERVAL_MS}ms`;
    });
    overlay.classList.add('is-typing');
}

function getSurveyVideoTypingDuration() {
    const overlay = document.querySelector('#survey-video .survey-video-overlay');
    if (!overlay) return 0;
    const lineCount = overlay.querySelectorAll('.survey-video-line').length;
    if (lineCount === 0) return 0;
    return (lineCount - 1) * TEXT_LINE_INTERVAL_MS + 800;
}

function initSurveyVideoPlayback() {
    const videoWrapper = document.getElementById('survey-video');
    const video = videoWrapper?.querySelector('video');
    if (!videoWrapper || !video) return;

    video.playbackRate = 1.5;
    video.loop = false;
    video.addEventListener('ended', () => {
        if (!updateSurveyVideoVisibility.wasActive) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
        scheduleSurveyVideoOverlay();
    });
}

const adminPanelState = {
    origins: new Map(),
    currentNode: null,
    enabled: false,
    portraitTimerId: null
};

function isMobileView() {
    return window.matchMedia('(max-width: 1024px)').matches;
}

function isLandscape() {
    return window.matchMedia('(orientation: landscape)').matches;
}

function rememberMediaOrigin(node) {
    if (!node || adminPanelState.origins.has(node)) return;
    adminPanelState.origins.set(node, {
        parent: node.parentElement,
        next: node.nextElementSibling
    });
}

function restoreAdminMedia() {
    adminPanelState.origins.forEach((pos, node) => {
        if (!node || !pos.parent) return;
        if (pos.next && pos.next.parentElement === pos.parent) {
            pos.parent.insertBefore(node, pos.next);
        } else {
            pos.parent.appendChild(node);
        }
    });
    adminPanelState.currentNode = null;
}

function getAdminMediaForScreen(screenId) {
    if (screenId === 'demo-screen') {
        return document.getElementById('main-video');
    }
    if (screenId === 'qna-screen' || screenId === 'qna-question-screen') {
        return document.getElementById('qna-video');
    }
    if (screenId === 'info-screen') {
        return document.getElementById('info-gif');
    }
    if (screenId === 'survey-screen') {
        return document.getElementById('survey-video');
    }
    return null;
}

function updateAdminPanelContent() {
    const panel = document.getElementById('mobile-admin-panel');
    const panelBody = document.getElementById('mobile-admin-panel-body');
    if (!panel || !panelBody || !panel.classList.contains('is-open')) return;

    panel.classList.toggle('is-portrait', isMobileView() && !isLandscape());

    panelBody.innerHTML = '';
    restoreAdminMedia();

    if (panel.classList.contains('is-portrait')) {
        panelBody.innerHTML = '<p class="mobile-admin-empty">가로 모드에서 관리자 화면이 표시됩니다.</p>';
        schedulePortraitAutoClose();
        return;
    }

    const mediaNode = getAdminMediaForScreen(ScreenManager.currentScreen);
    if (!mediaNode) {
        panelBody.innerHTML = '<p class="mobile-admin-empty">이 화면에는 관리자용 미디어가 없습니다.</p>';
        return;
    }

    rememberMediaOrigin(mediaNode);
    panelBody.appendChild(mediaNode);
    adminPanelState.currentNode = mediaNode;
}

function openAdminPanel({ enable = false } = {}) {
    const panel = document.getElementById('mobile-admin-panel');
    if (!panel) return;
    if (enable) {
        adminPanelState.enabled = true;
    }
    panel.hidden = false;
    panel.classList.add('is-open');
    document.body.classList.add('is-admin-panel-open');
    updateAdminPanelContent();
}

function closeAdminPanel({ keepEnabled = false } = {}) {
    const panel = document.getElementById('mobile-admin-panel');
    const panelBody = document.getElementById('mobile-admin-panel-body');
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.classList.remove('is-portrait');
    panel.hidden = true;
    document.body.classList.remove('is-admin-panel-open');
    if (panelBody) {
        panelBody.innerHTML = '';
    }
    restoreAdminMedia();
    if (!keepEnabled) {
        adminPanelState.enabled = false;
    }
    clearPortraitAutoClose();
}

function clearPortraitAutoClose() {
    if (adminPanelState.portraitTimerId) {
        clearTimeout(adminPanelState.portraitTimerId);
        adminPanelState.portraitTimerId = null;
    }
}

function schedulePortraitAutoClose() {
    clearPortraitAutoClose();
    adminPanelState.portraitTimerId = setTimeout(() => {
        if (!adminPanelState.enabled) return;
        closeAdminPanel();
    }, 5000);
}

function syncAdminPanelOrientation() {
    if (!isMobileView() || !adminPanelState.enabled) return;
    if (isLandscape()) {
        clearPortraitAutoClose();
        openAdminPanel();
    } else {
        openAdminPanel();
        updateAdminPanelContent();
    }
}

function initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const adminBtn = document.getElementById('mobile-admin-btn');
    const adminClose = document.getElementById('mobile-admin-close');
    const adminPanel = document.getElementById('mobile-admin-panel');
    const rotateHint = document.getElementById('mobile-rotate-hint');

    if (!menu) return;

    const menuButtons = document.querySelectorAll('.mobile-menu-btn');
    if (!menuButtons.length) return;

    const closeMenu = () => {
        menu.classList.remove('is-open');
        menu.hidden = true;
        menuButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    };

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isOpen = menu.classList.contains('is-open');
            if (isOpen) {
                closeMenu();
                return;
            }
            menu.classList.add('is-open');
            menu.hidden = false;
            menuButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
        });
    });

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            closeMenu();
            openAdminPanel({ enable: true });
        });
    }

    if (adminClose) {
        adminClose.addEventListener('click', () => closeAdminPanel());
    }

    if (adminPanel) {
        adminPanel.addEventListener('click', (event) => {
            if (event.target === adminPanel) {
                closeAdminPanel();
            }
        });
    }

    if (rotateHint) {
        rotateHint.addEventListener('click', () => {
            closeAdminPanel();
        });
    }

    document.addEventListener('click', (event) => {
        const isMenuButton = event.target.closest('.mobile-menu-btn');
        if (!menu.contains(event.target) && !isMenuButton) {
            closeMenu();
        }
    });

    window.addEventListener('orientationchange', syncAdminPanelOrientation);
    window.addEventListener('resize', syncAdminPanelOrientation);
}

function scheduleQnaVideoOverlay() {
    const videoWrapper = document.getElementById('qna-video');
    if (!videoWrapper) return;

    const delay = parseInt(videoWrapper.dataset.overlayDelay || '4000', 10);
    if (videoWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.overlayTimerId, 10));
    }
    if (videoWrapper.dataset.fadeTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.fadeTimerId, 10));
    }

    videoWrapper.classList.remove('is-dimmed');
    resetQnaVideoTyping();
    const timerId = setTimeout(() => {
        videoWrapper.classList.add('is-dimmed');
        startQnaVideoTyping();
        const totalDuration = getQnaVideoTypingDuration() + TEXT_HOLD_MS;
        const fadeTimerId = setTimeout(() => {
            videoWrapper.classList.remove('is-dimmed');
            resetQnaVideoTyping();
        }, Math.max(0, totalDuration));
        videoWrapper.dataset.fadeTimerId = String(fadeTimerId);
    }, Math.max(0, delay));

    videoWrapper.dataset.overlayTimerId = String(timerId);
}

function resetQnaVideoOverlay() {
    const videoWrapper = document.getElementById('qna-video');
    if (!videoWrapper) return;

    if (videoWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.overlayTimerId, 10));
        videoWrapper.dataset.overlayTimerId = '';
    }
    if (videoWrapper.dataset.fadeTimerId) {
        clearTimeout(parseInt(videoWrapper.dataset.fadeTimerId, 10));
        videoWrapper.dataset.fadeTimerId = '';
    }
    videoWrapper.classList.remove('is-dimmed');
    resetQnaVideoTyping();
}

function resetQnaVideoTyping() {
    const overlay = document.querySelector('#qna-video .qna-video-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-typing');
    const lines = overlay.querySelectorAll('.qna-video-line');
    lines.forEach(line => {
        line.style.animationDelay = '0ms';
    });
}

function startQnaVideoTyping() {
    const overlay = document.querySelector('#qna-video .qna-video-overlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.qna-video-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * TEXT_LINE_INTERVAL_MS}ms`;
    });
    overlay.classList.add('is-typing');
}

function getQnaVideoTypingDuration() {
    const overlay = document.querySelector('#qna-video .qna-video-overlay');
    if (!overlay) return 0;
    const lineCount = overlay.querySelectorAll('.qna-video-line').length;
    if (lineCount === 0) return 0;
    return (lineCount - 1) * TEXT_LINE_INTERVAL_MS + 800;
}

function initQnaVideoPlayback() {
    const videoWrapper = document.getElementById('qna-video');
    const video = videoWrapper?.querySelector('video');
    if (!videoWrapper || !video) return;

    video.playbackRate = 1.5;
    video.loop = false;
    video.addEventListener('ended', () => {
        if (!updateQnaVideoVisibility.wasActive) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
        scheduleQnaVideoOverlay();
    });
}

function playInfoGif() {
    const gifWrapper = document.getElementById('info-gif');
    if (!gifWrapper) return;

    const img = gifWrapper.querySelector('img');
    if (!img) return;

    const src = gifWrapper.dataset.src || img.src;
    const duration = parseInt(gifWrapper.dataset.durationMs || '4000', 10);
    const loops = parseInt(gifWrapper.dataset.loops || '2', 10);
    const totalDuration = Math.max(1, duration) * Math.max(1, loops);

    img.dataset.staticFrame = '';
    img.addEventListener('load', () => {
        if (img.dataset.staticFrame) return;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                img.dataset.staticFrame = canvas.toDataURL('image/png');
            }
        } catch (e) {
            // ignore
        }
    }, { once: true });
    img.src = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;

    if (gifWrapper.dataset.timerId) {
        clearTimeout(parseInt(gifWrapper.dataset.timerId, 10));
    }
    const timerId = setTimeout(() => {
        if (img.dataset.staticFrame) {
            img.src = img.dataset.staticFrame;
        }
    }, totalDuration);
    gifWrapper.dataset.timerId = String(timerId);
}

function scheduleInfoGifOverlay() {
    const gifWrapper = document.getElementById('info-gif');
    if (!gifWrapper) return;
    const delay = parseInt(gifWrapper.dataset.overlayDelay || '4000', 10);

    if (gifWrapper.dataset.overlayTimerId) {
        clearTimeout(parseInt(gifWrapper.dataset.overlayTimerId, 10));
    }

    gifWrapper.classList.remove('is-dimmed');
    resetInfoGifTyping();
    const timerId = setTimeout(() => {
        gifWrapper.classList.add('is-dimmed');
        startInfoGifTyping();
    }, Math.max(0, delay));

    gifWrapper.dataset.overlayTimerId = String(timerId);
}

function resetInfoGifTyping() {
    const overlay = document.querySelector('#info-gif .info-gif-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-typing');
    const lines = overlay.querySelectorAll('.info-gif-line');
    lines.forEach(line => {
        line.style.animationDelay = '0ms';
    });
}

function startInfoGifTyping() {
    const overlay = document.querySelector('#info-gif .info-gif-overlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.info-gif-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * 1000}ms`;
    });
    overlay.classList.add('is-typing');
}

document.addEventListener('click', (event) => {
    const gifWrapper = document.getElementById('info-gif');
    if (!gifWrapper || !gifWrapper.classList.contains('is-visible')) return;
    const img = gifWrapper.querySelector('img');
    if (!img) return;
    if (event.target.closest('#info-gif')) {
        playInfoGif();
        scheduleInfoGifOverlay();
    }
});

// 말풍선 표시 함수
function showBalloon(balloonId, delay) {
    const balloon = document.getElementById(balloonId);
    if (balloon) {
        balloon.style.display = 'flex';
        balloon.style.opacity = '0';
        balloon.className = `balloon animation-${delay}`;
        setTimeout(() => {
            balloon.style.opacity = '1';
        }, delay * 100);
    }
}

// 말풍선 숨김 함수
function hideBalloon(balloonId) {
    const balloon = document.getElementById(balloonId);
    if (balloon) {
        balloon.style.display = 'none';
        balloon.style.opacity = '0';
    }
}

// 모든 말풍선 숨김
function hideAllBalloons() {
    document.querySelectorAll('.balloon').forEach(balloon => {
        balloon.style.display = 'none';
        balloon.style.opacity = '0';
        balloon.classList.remove('animation-3', 'animation-9', 'animation-15');
    });
}

// 페이지별 말풍선 업데이트 (하드코딩된 말풍선은 항상 표시)
function updateBalloons() {
    // 하드코딩된 말풍선은 항상 표시되므로 별도 처리 불필요
}

// 말풍선 표시/숨김 관리
function showMainBalloons() {
    const mainBalloon1 = document.getElementById('balloon-main-1');
    const mainBalloon2 = document.getElementById('balloon-main-2');

    if (mainBalloon1) {
        mainBalloon1.style.display = 'flex';
        mainBalloon1.style.opacity = '1';
    }
    if (mainBalloon2) {
        mainBalloon2.style.display = 'flex';
        mainBalloon2.style.opacity = '1';
    }
}

// 전역 뒤로가기 함수
window.goBack = function() {
    ScreenManager.goBack();
    // 뒤로가기 시 말풍선 업데이트
    ScreenManager.updateBalloons();
};

// 폼 유효성 검사
function initFormValidation() {
    const form = document.getElementById('registration-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const contactInput = document.getElementById('contact-input');
    const ageConsent = document.getElementById('age-consent');
    const privacyConsent = document.getElementById('privacy-consent');
    const signupConsent = document.getElementById('signup-consent');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!nameInput || !emailInput || !contactInput || !ageConsent || !privacyConsent || !signupConsent || !submitBtn) return;
    
    // 실시간 유효성 검사
    function validateForm() {
        let isValid = true;
        
        // 이름 검사
        if (nameInput.value.length < 2) {
            isValid = false;
        }
        
        // 이메일 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
        }
        
        // 연락처 검사
        const contactNumber = contactInput.value.replace(/[^0-9]/g, '');
        if (contactNumber.length !== 11) {
            isValid = false;
        }
        
        // 약관동의 검사
        if (!ageConsent.checked || !privacyConsent.checked || !signupConsent.checked) {
            isValid = false;
        }
        
        submitBtn.disabled = !isValid;
    }
    
    // 이름 검사
    nameInput.addEventListener('input', () => {
        const nameError = document.getElementById('name-error');
        if (nameError) {
            if (nameInput.value.length > 0 && nameInput.value.length < 2) {
                nameError.textContent = '2자 이상으로 작성하세요.';
                nameError.classList.add('show');
            } else {
                nameError.classList.remove('show');
            }
        }
        validateForm();
    });
    
    // 이메일 검사
    emailInput.addEventListener('input', () => {
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailError) {
            if (emailInput.value.length > 0 && !emailRegex.test(emailInput.value)) {
                emailError.textContent = '이메일 형식에 맞지않습니다.';
                emailError.classList.add('show');
            } else {
                emailError.classList.remove('show');
            }
        }
        validateForm();
    });
    
    // 연락처 검사 및 포맷팅
    contactInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length >= 11) {
            value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        }
        
        e.target.value = value;
        
        const contactError = document.getElementById('contact-error');
        const contactNumber = value.replace(/[^0-9]/g, '');
        if (contactError) {
            if (contactNumber.length > 0 && contactNumber.length !== 11) {
                contactError.textContent = '숫자만 입력 가능합니다.';
                contactError.classList.add('show');
            } else {
                contactError.classList.remove('show');
            }
        }
        validateForm();
    });
    
    // 약관동의 검사
    [ageConsent, privacyConsent, signupConsent].forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const errorId = checkbox.id.replace('-consent', '-error');
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                if (!checkbox.checked && checkbox.required) {
                    errorEl.textContent = '이 항목은 필수 입니다';
                    errorEl.classList.add('show');
                } else {
                    errorEl.classList.remove('show');
                }
            }
            validateForm();
        });
    });
    
    // 폼 제출
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!submitBtn.disabled) {
            // 참가자 정보 저장
            const participant = {
                id: Date.now(),
                name: nameInput.value,
                email: emailInput.value,
                phone: contactInput.value.replace(/[^0-9]/g, ''),
                marketingConsent: document.getElementById('marketing-consent')?.checked || false,
                registeredAt: new Date().toISOString()
            };
            
            DemoData.participants.push(participant);
            DemoData.currentUser = participant;
            saveData();
            
            // 데모 화면으로 이동
            ScreenManager.show('demo-screen');
            
            // 스크린에 환영 메시지 표시
            ScreenManager.updateScreen(`
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">👋</div>
                    <h2 style="margin-bottom: 12px;">환영합니다!</h2>
                    <p style="color: #666; font-size: 16px; margin-bottom: 8px;">${participant.name}님, 이벤터스 솔루션 체험을 시작합니다.</p>
                    <p style="color: #999; font-size: 14px;">핸드폰에서 기능을 선택해보세요.</p>
                </div>
            `);
        }
    });
}

// 데모 화면 초기화 (등록 없이 바로 접속)
function initDemoScreen() {
    // 기본 사용자 정보 설정 (데모용)
    if (!DemoData.currentUser) {
        DemoData.currentUser = {
            id: Date.now(),
            name: '데모 사용자',
            email: 'demo@example.com',
            phone: '01000000000',
            marketingConsent: false,
            registeredAt: new Date().toISOString()
        };
        saveData();
    }
}

function restoreActiveScreen() {
    let screenId = '';
    try {
        screenId = localStorage.getItem('activeScreen') || '';
    } catch (e) {
        screenId = '';
    }

    if (!screenId) return;

    const target = document.getElementById(screenId);
    if (!target) return;

    // 메인 화면이면 복원하지 않음
    if (screenId === 'demo-screen') return;

    // 화면별 히스토리 설정
    if (screenId === 'qna-question-screen') {
        ScreenManager.screenHistory = ['demo-screen', 'qna-screen'];
    } else {
        ScreenManager.screenHistory = ['demo-screen'];
    }
    
    ScreenManager.show(screenId);
    ScreenManager.setPage(2);
}

// 모달 관리
function initModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalClose || !modalBody) return null;
    
    function closeModal() {
        modal.classList.remove('active');
    }
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    return {
        show: (content) => {
            modalBody.innerHTML = content;
            modal.classList.add('active');
        },
        close: closeModal
    };
}

// 기능 카드 클릭 처리
function initFeatureCards() {
    const sectionButtons = document.querySelectorAll('.section-btn');
    
    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const feature = button.dataset.feature;
            handleFeatureClick(feature);
        });
    });
}

// 공지사항 드롭다운 기능
function initNoticeDropdown() {
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.notice-toggle, .notice-item-header');
        if (toggle) {
            e.preventDefault();
            const noticeItem = toggle.closest('.notice-item');
            if (noticeItem) {
                noticeItem.classList.toggle('expanded');
            }
        }
    });
}

// 공지사항 토글 기능 (initNoticeDropdown의 별칭)
function initNoticeToggle() {
    initNoticeDropdown();
}

// 기능별 처리
function handleFeatureClick(feature, modal) {
    let screenId = '';
    let screenContent = '';
    
    // 페이지 설정
    ScreenManager.setPage(2);
    
    switch(feature) {
        case 'info':
            screenId = 'info-screen';
            break;
        case 'qna':
            screenId = 'qna-screen';
            break;
        case 'survey':
            screenId = 'survey-screen';
            break;
        case 'lottery':
            screenId = 'lottery-screen';
            break;
        default:
            screenContent = '<p>준비 중인 기능입니다.</p>';
    }
    
    if (screenId) {
        ScreenManager.show(screenId);
    }
    if (screenContent) {
        ScreenManager.updateScreen(screenContent);
    }
}

function initQnaTabs() {
    const buttons = document.querySelectorAll('.qna-tab-button');
    const panels = document.querySelectorAll('.qna-tab-panel');
    if (!buttons.length || !panels.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');
            buttons.forEach(btn => btn.classList.remove('is-active'));
            button.classList.add('is-active');
            panels.forEach(panel => {
                panel.classList.toggle('is-active', panel.id === target);
            });
        });
    });
}

function initSurveyTabs() {
    const buttons = document.querySelectorAll('.survey-tab-button');
    const panels = document.querySelectorAll('.survey-tab-panel');
    if (!buttons.length || !panels.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');
            buttons.forEach(btn => btn.classList.remove('is-active'));
            button.classList.add('is-active');
            panels.forEach(panel => {
                panel.classList.toggle('is-active', panel.id === target);
            });
        });
    });
}

function initSurveySubmit() {
    const surveyContent = document.querySelector('.survey-content');
    const submitBtn = document.querySelector('.survey-submit-btn');
    const completeScreen = document.getElementById('survey-complete');
    const completeBtn = document.querySelector('.survey-complete-btn');
    const tabPanels = document.querySelectorAll('.survey-tab-panel');
    const tabs = document.querySelector('.survey-tabs');
    
    if (!submitBtn || !completeScreen || !completeBtn) return;

    submitBtn.addEventListener('click', () => {
        // 탭과 설문 패널 숨기기
        tabPanels.forEach(panel => panel.style.display = 'none');
        if (tabs) tabs.style.display = 'none';
        
        // 완료 화면 표시
        completeScreen.classList.add('is-active');
    });

    completeBtn.addEventListener('click', () => {
        // 완료 화면 숨기기
        completeScreen.classList.remove('is-active');
        
        // 탭과 설문 패널 다시 표시
        if (tabs) tabs.style.display = '';
        tabPanels.forEach(panel => {
            panel.style.display = '';
        });
        
        // 제출 완료 상태로 변경
        if (surveyContent) {
            surveyContent.classList.add('is-submitted');
        }
        
        // 제출 버튼 비활성화
        submitBtn.disabled = true;
        submitBtn.textContent = '제출완료';
    });
}

function initQnaQuestionNavigation() {
    document.addEventListener('click', (event) => {
        const fab = event.target.closest('.qna-fab');
        const speakerAction = event.target.closest('.qna-speaker-action');
        if (fab || speakerAction) {
            ScreenManager.show('qna-question-screen');
        }
    });
}

function initQnaQuestionSelect() {
    const wrapper = document.querySelector('.qna-form-select-wrapper');
    if (!wrapper) return;

    const button = wrapper.querySelector('.qna-form-select');
    const options = wrapper.querySelector('.qna-form-options');
    const name = wrapper.querySelector('.qna-form-select-name');
    const avatarText = wrapper.querySelector('.qna-form-avatar');
    const avatarImg = wrapper.querySelector('.qna-form-avatar-img');
    const leftGroup = wrapper.querySelector('.qna-form-select-left');

    if (!button || !options || !name || !avatarText || !avatarImg || !leftGroup) return;

    const setAllState = () => {
        name.textContent = '전체';
        avatarText.textContent = '전체';
        avatarText.classList.remove('is-yellow');
        avatarText.classList.add('is-purple');
        leftGroup.classList.remove('is-image');
    };

    setAllState();

    const closeOptions = () => {
        options.hidden = true;
        button.setAttribute('aria-expanded', 'false');
    };

    button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        options.hidden = isOpen;
        button.setAttribute('aria-expanded', String(!isOpen));
    });

    options.addEventListener('click', (event) => {
        const option = event.target.closest('.qna-form-option');
        if (!option) return;

        const label = option.getAttribute('data-label') || option.textContent.trim();
        const avatar = option.getAttribute('data-avatar');
        name.textContent = label;

        options.querySelectorAll('.qna-form-option').forEach(item => {
            item.classList.toggle('is-active', item === option);
        });

        if (avatar) {
            avatarImg.src = avatar;
            avatarImg.alt = label;
            leftGroup.classList.add('is-image');
        } else {
            leftGroup.classList.remove('is-image');
            avatarText.textContent = label;
            if (label === '전체') {
                avatarText.classList.remove('is-yellow');
                avatarText.classList.add('is-purple');
            } else {
                avatarText.classList.remove('is-purple');
                avatarText.classList.add('is-yellow');
            }
        }

        closeOptions();
    });

    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) {
            closeOptions();
        }
    });
}

function initQnaQuestionForm() {
    const screen = document.getElementById('qna-question-screen');
    if (!screen) return;

    const nameInput = screen.querySelector('#qna-name-input');
    const textarea = screen.querySelector('#qna-question-input');
    const count = screen.querySelector('#qna-question-count');
    const submit = screen.querySelector('#qna-question-submit');
    if (!nameInput || !textarea || !count || !submit) return;

    const updateState = () => {
        if (textarea.value.length > 140) {
            textarea.value = textarea.value.slice(0, 140);
        }
        const length = textarea.value.length;
        count.textContent = `${length} / 140`;
        const isActive = length > 0;
        submit.disabled = !isActive;
        submit.classList.toggle('is-active', isActive);
    };

    textarea.addEventListener('input', updateState);
    nameInput.addEventListener('input', updateState);
    submit.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (!message) return;

        const list = document.getElementById('qna-question-list');
        if (!list) return;

        const selectedTarget = document.querySelector('.qna-form-select-name');
        const targetLabel = selectedTarget ? selectedTarget.textContent.trim() : '전체';
        const author = nameInput.value.trim() || '익명';
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const item = document.createElement('div');
        item.className = 'qna-question-item';
        item.setAttribute('data-speaker', targetLabel);
        item.setAttribute('data-status', 'mine');
        item.setAttribute('data-created', String(Date.now()));

        const header = document.createElement('div');
        header.className = 'qna-question-header';

        const authorEl = document.createElement('span');
        authorEl.className = 'qna-question-author';
        authorEl.textContent = author;

        const targetEl = document.createElement('span');
        targetEl.className = 'qna-question-target';
        targetEl.textContent = '→ ';

        const badge = document.createElement('span');
        badge.className = 'qna-target-badge';
        if (targetLabel === '전체') {
            badge.classList.add('is-all');
        } else {
            badge.classList.add('is-james');
        }
        badge.textContent = targetLabel;
        targetEl.appendChild(badge);

        const timeEl = document.createElement('span');
        timeEl.className = 'qna-question-time';
        timeEl.textContent = time;

        header.append(authorEl, targetEl, timeEl);

        const body = document.createElement('p');
        body.className = 'qna-question-body';
        body.textContent = message;

        const actions = document.createElement('div');
        actions.className = 'qna-question-actions';
        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = 'favorite_border';
        const countEl = document.createElement('span');
        countEl.textContent = '0';
        actions.append(icon, countEl);

        item.append(header, body, actions);
        list.prepend(item);

        textarea.value = '';
        updateState();
        if (typeof window.applyQnaSpeakerFilter === 'function') {
            const current = list.getAttribute('data-filter') || 'all';
            window.applyQnaSpeakerFilter(current);
        }
        if (typeof window.applyQnaSort === 'function') {
            window.applyQnaSort();
        }
        ScreenManager.show('qna-screen');
    });
    updateState();
}

function initDetailHeaderActions() {
    const headers = document.querySelectorAll('.detail-header');
    headers.forEach(header => {
        if (header.querySelector('.detail-header-action')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'detail-header-action';
        button.innerHTML = '세션 이동 <span class="material-symbols-outlined">login</span>';
        button.addEventListener('click', () => {
            ScreenManager.show('demo-screen', { skipHistory: true });
            ScreenManager.setPage(2);
        });
        header.appendChild(button);
    });
}

function initDetailHeaderStatus() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    const headers = document.querySelectorAll('.detail-header');
    if (!headers.length) return;

    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    headers.forEach(header => {
        if (header.querySelector('.detail-statusbar')) return;

        header.classList.add('has-status');
        header.style.position = 'relative';

        const bar = document.createElement('div');
        bar.className = 'detail-statusbar';

        const time = document.createElement('span');
        time.className = 'detail-status-time';
        time.textContent = updateTime();

        const icons = document.createElement('div');
        icons.className = 'detail-status-icons';
        icons.innerHTML = `
            <span class="material-symbols-outlined">wifi</span>
            <span class="detail-status-battery" aria-hidden="true"></span>
        `;

        bar.append(time, icons);
        header.prepend(bar);

        setInterval(() => {
            time.textContent = updateTime();
        }, 60000);
    });
}

function initMobileHeaderMenus() {
    if (!window.matchMedia('(max-width: 1024px)').matches) return;
    const headers = document.querySelectorAll('.detail-header');
    if (!headers.length) return;

    headers.forEach(header => {
        if (header.querySelector('.mobile-menu-btn')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-menu-btn';
        button.setAttribute('aria-label', '메뉴 열기');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = '<span class="material-icons">menu</span>';
        header.prepend(button);
    });
}

function initQnaSpeakerFilter() {
    const pills = document.querySelectorAll('.qna-speaker-pill');
    const list = document.getElementById('qna-question-list');
    const empty = document.getElementById('qna-empty-state');
    if (!pills.length || !list) return;

    const fab = list.querySelector(':scope > .qna-fab');

    const applyFilter = (speaker) => {
        const status = list.getAttribute('data-status-filter') || 'all';
        const items = list.querySelectorAll('.qna-question-item');
        let visibleCount = 0;
        let firstVisible = null;
        items.forEach(item => {
            const itemSpeaker = item.getAttribute('data-speaker') || '전체';
            const itemStatus = item.getAttribute('data-status') || 'all';
            const matchesSpeaker = speaker === 'all' ? true : itemSpeaker === speaker;
            const matchesStatus = status === 'all' ? itemStatus !== 'answered' : itemStatus === status;
            const show = matchesSpeaker && matchesStatus;
            item.style.display = show ? '' : 'none';
            item.classList.remove('is-first-visible');
            if (show) visibleCount += 1;
            if (show && !firstVisible) {
                firstVisible = item;
            }
        });
        if (firstVisible) {
            firstVisible.classList.add('is-first-visible');
        }

        const isLucyOrJune = speaker === 'Lucy' || speaker === 'June';
        const showEmpty = ((isLucyOrJune || status === 'mine') || (status === 'answered' && speaker === 'James')) && visibleCount === 0;
        if (empty) {
            empty.hidden = !showEmpty;
            empty.style.display = showEmpty ? 'block' : 'none';
        }
        if (fab) {
            fab.style.display = showEmpty ? 'none' : '';
        }
        list.setAttribute('data-filter', speaker);
    };

    window.applyQnaSpeakerFilter = applyFilter;
    applyFilter('all');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const speaker = pill.getAttribute('data-speaker') || 'all';
            pills.forEach(btn => btn.classList.remove('is-active'));
            pill.classList.add('is-active');
            applyFilter(speaker);
        });
    });
}

function initQnaFilterTabs() {
    const tabs = document.querySelectorAll('.qna-filter-tab');
    const list = document.getElementById('qna-question-list');
    if (!tabs.length || !list) return;

    const map = {
        '전체': 'all',
        '답변 완료': 'answered',
        '내 질문': 'mine'
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(btn => btn.classList.remove('is-active'));
            tab.classList.add('is-active');
            const key = map[tab.textContent.trim()] || 'all';
            list.setAttribute('data-status-filter', key);
            if (typeof window.applyQnaSpeakerFilter === 'function') {
                const current = list.getAttribute('data-filter') || 'all';
                window.applyQnaSpeakerFilter(current);
            }
            if (typeof window.applyQnaSort === 'function') {
                window.applyQnaSort();
            }
        });
    });
}

function initQnaLikes() {
    document.addEventListener('click', (event) => {
        const icon = event.target.closest('.qna-question-actions .material-icons');
        if (!icon) return;

        const actions = icon.closest('.qna-question-actions');
        if (!actions) return;

        const countEl = actions.querySelector('span:last-child');
        const current = countEl ? parseInt(countEl.textContent, 10) : 0;
        const isLiked = actions.dataset.liked === 'true';

        if (isLiked) {
            if (countEl) {
                countEl.textContent = String(Math.max(0, current - 1));
            }
            icon.classList.remove('is-liked');
            icon.textContent = 'favorite_border';
            actions.dataset.liked = 'false';
            return;
        }

        if (countEl) {
            countEl.textContent = String(current + 1);
        }
        icon.classList.add('is-liked');
        icon.textContent = 'favorite';
        actions.dataset.liked = 'true';
        if (typeof window.applyQnaSort === 'function') {
            window.applyQnaSort();
        }
    });
}

function initQnaSort() {
    const list = document.getElementById('qna-question-list');
    const select = document.querySelector('.qna-sort');
    if (!list || !select) return;

    const ensureCreated = () => {
        const now = new Date();
        list.querySelectorAll('.qna-question-item').forEach(item => {
            if (item.dataset.created) return;
            const timeText = item.querySelector('.qna-question-time')?.textContent?.trim() || '';
            const match = timeText.match(/^(\d{1,2}):(\d{2})$/);
            if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);
                const stamp = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    hours,
                    minutes,
                    0,
                    0
                ).getTime();
                item.dataset.created = String(stamp);
            } else {
                item.dataset.created = String(Date.now());
            }
        });
    };

    const getLikeCount = (item) => {
        const countEl = item.querySelector('.qna-question-actions span:last-child');
        return countEl ? parseInt(countEl.textContent, 10) : 0;
    };

        const sortItems = () => {
        ensureCreated();
        const mode = select.value;
        const items = Array.from(list.querySelectorAll('.qna-question-item'));
        const empty = list.querySelector('#qna-empty-state');
        const fab = list.querySelector(':scope > .qna-fab');

        items.sort((a, b) => {
            const aCreated = parseInt(a.dataset.created || '0', 10);
            const bCreated = parseInt(b.dataset.created || '0', 10);
            if (mode === '등록순') {
                return aCreated - bCreated;
            }
            if (mode === '좋아요순') {
                const aLiked = a.querySelector('.qna-question-actions')?.dataset.liked === 'true';
                const bLiked = b.querySelector('.qna-question-actions')?.dataset.liked === 'true';
                if (aLiked !== bLiked) return aLiked ? -1 : 1;
                const aLikes = getLikeCount(a);
                const bLikes = getLikeCount(b);
                if (aLikes !== bLikes) return bLikes - aLikes;
                return bCreated - aCreated;
            }
            const aMine = a.dataset.status === 'mine';
            const bMine = b.dataset.status === 'mine';
            if (aMine !== bMine) return aMine ? -1 : 1;
            return bCreated - aCreated;
        });

        items.forEach(item => list.appendChild(item));
        if (empty) list.appendChild(empty);
        if (fab) list.appendChild(fab);

        if (typeof window.applyQnaSpeakerFilter === 'function') {
            const current = list.getAttribute('data-filter') || 'all';
            window.applyQnaSpeakerFilter(current);
        }
    };

    window.applyQnaSort = sortItems;
    select.addEventListener('change', sortItems);
    sortItems();
}

// 섹션 접기/펼치기 기능
function initSectionToggle() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.content-section');
            const toggle = header.querySelector('.section-toggle');
            
            // 다른 섹션들의 선택 상태 제거
            document.querySelectorAll('.content-section').forEach(sec => {
                if (sec !== section) {
                    sec.classList.remove('selected');
                }
            });
            
            // 현재 섹션 선택 상태 토글
            section.classList.toggle('selected');
            
            // 펼침/접힘 토글
            section.classList.toggle('collapsed');
            if (toggle) {
                toggle.classList.toggle('collapsed');
            }
        });
    });
}

// 아이콘 선택 기능
function initIconSelector() {
    // Google Material Icons 목록 (이미지에 있는 아이콘들)
    const availableIcons = [
        'mic', 'volume_up', 'info', 'checklist', 'description',
        'access_time', 'help_outline', 'chat_bubble_outline', 'favorite', 'language',
        'card_giftcard', 'school', 'attach_money', 'location_on', 'download',
        'cloud', 'folder', 'cloud_upload', 'thumb_up', 'link',
        'movie', 'help', 'public', 'menu', 'apps',
        'calendar_today', 'home', 'search', 'lightbulb', 'people',
        'person', 'notifications', 'mail', 'add_circle', 'photo_library',
        'camera_alt', 'palette', 'place', 'description', 'contact_page',
        'view_module', 'attach_file', 'folder_open', 'arrow_downward', 'place',
        'map', 'play_arrow', 'play_circle', 'videocam', 'star',
        'star_border', 'warning', 'error', 'bar_chart', 'tv',
        'laptop', 'computer', 'phone_android', 'wb_sunny', 'help_outline',
        'apps', 'format_list_numbered', 'insert_drive_file', 'bar_chart', 'rocket_launch',
        'percent', 'list', 'flag', 'stamp', 'flash_on'
    ];
    
    // 아이콘 그리드 생성
    const iconGrid = document.getElementById('icon-grid');
    if (!iconGrid) return;
    
    availableIcons.forEach(iconName => {
        const iconItem = document.createElement('div');
        iconItem.className = 'icon-item';
        iconItem.innerHTML = `<span class="material-icons">${iconName}</span>`;
        iconItem.dataset.icon = iconName;
        
        iconItem.addEventListener('click', () => {
            // 선택된 아이콘 표시
            document.querySelectorAll('.icon-item').forEach(item => {
                item.classList.remove('selected');
            });
            iconItem.classList.add('selected');
            
            // 선택된 아이콘을 현재 편집 중인 요소에 적용
            if (window.currentIconTarget) {
                const iconElement = window.currentIconTarget.querySelector('.section-icon .material-icons, .btn-icon .material-icons');
                if (iconElement) {
                    iconElement.textContent = iconName;
                }
            }
        });
        
        iconGrid.appendChild(iconItem);
    });
    
    // 아이콘 모달 닫기
    const iconModal = document.getElementById('icon-modal');
    const iconModalClose = document.getElementById('icon-modal-close');
    
    if (iconModalClose && iconModal) {
        iconModalClose.addEventListener('click', () => {
            iconModal.classList.remove('active');
            window.currentIconTarget = null;
        });
    }
    
    if (iconModal) {
        iconModal.addEventListener('click', (e) => {
            if (e.target === iconModal) {
                iconModal.classList.remove('active');
                window.currentIconTarget = null;
            }
        });
    }
}

// 아이콘 편집 기능 (섹션 헤더 아이콘 클릭 시)
function initIconEdit() {
    // 섹션 아이콘 클릭 시 아이콘 선택 모달 열기
    document.addEventListener('click', (e) => {
        const sectionIcon = e.target.closest('.section-icon');
        if (sectionIcon && !e.target.closest('.section-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            
            window.currentIconTarget = sectionIcon.closest('.content-section');
            const iconModal = document.getElementById('icon-modal');
            if (iconModal) {
                iconModal.classList.add('active');
            }
        }
        
        // 버튼 아이콘 클릭 시 아이콘 선택 모달 열기
        const btnIcon = e.target.closest('.btn-icon');
        if (btnIcon && !e.target.closest('.section-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            window.currentIconTarget = btnIcon.closest('.section-btn');
            const iconModal = document.getElementById('icon-modal');
            if (iconModal) {
                iconModal.classList.add('active');
            }
        }
    });
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 데모 화면 초기화 (등록 없이 바로 접속)
    initDemoScreen();
    restoreActiveScreen();
    
    initFormValidation();
    initFeatureCards();
    initSectionToggle();
    initQnaTabs();
    initSurveyTabs();
    initSurveySubmit();
    initQnaSpeakerFilter();
    initQnaFilterTabs();
    initQnaLikes();
    initQnaSort();
    initQnaQuestionNavigation();
    initQnaQuestionSelect();
    initQnaQuestionForm();
    initDetailHeaderActions();
    initDetailHeaderStatus();
    initIconSelector();
    initIconEdit();
    initNoticeToggle(); // 공지사항 토글 기능 초기화
    initQnaVideoPlayback();
    initMainVideoPlayback();
    initSurveyVideoPlayback();
    initMobileHeaderMenus();
    initMobileMenu();
    updateInfoGifVisibility(ScreenManager.currentScreen);
    updateQnaVideoVisibility(ScreenManager.currentScreen);
    updateMainVideoVisibility(ScreenManager.currentScreen);
    updateSurveyVideoVisibility(ScreenManager.currentScreen);
    
    // 로그인 링크 클릭 (간단한 처리)
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('로그인 기능은 데모 버전에서 제공되지 않습니다.');
        });
    }
    
    // 뒤로가기 버튼 이벤트 리스너
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            ScreenManager.goBack();
            // 뒤로가기 시 페이지 2로 복귀
            if (ScreenManager.currentScreen === 'demo-screen') {
                ScreenManager.setPage(2);
            }
            // 말풍선 업데이트
            ScreenManager.updateBalloons();
        });
    });

    // 브라우저 뒤로가기 처리
    window.addEventListener('popstate', () => {
        ScreenManager.goBack();
        if (ScreenManager.currentScreen === 'demo-screen') {
            ScreenManager.setPage(2);
        }
        ScreenManager.updateBalloons();
    });
    
    // 초기 페이지 설정 (상단 버튼 즉시 노출)
    ScreenManager.setPage(2);
    // 메인 화면 말풍선 표시
    if (ScreenManager.currentScreen === 'demo-screen') {
        showMainBalloons();
    }
});
