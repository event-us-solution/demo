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
        updateInfoVideoVisibility(this.currentScreen);
        updateQnaVideoVisibility(this.currentScreen);
        updateMainVideoVisibility(this.currentScreen);
        updateSurveyVideoVisibility(this.currentScreen);
        updateLotteryVideoVisibility(this.currentScreen);
        updateAdminPanelContent();
        updateBottomNavActive(screenId);
    },
    
    // 화면별 말풍선 업데이트
    updateBalloons() {
        // 모든 말풍선 숨김
        hideAllBalloons();
        
        // 현재 화면에 맞는 말풍선 표시
        const mainTabScreens = ['demo-screen', 'myinfo-screen', 'networking-screen', 'settings-screen'];
        const balloonContainer = document.getElementById('balloon-container');
        if (balloonContainer) {
            balloonContainer.style.display = mainTabScreens.includes(this.currentScreen) ? 'none' : 'flex';
        }

        if (mainTabScreens.includes(this.currentScreen)) {
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

function updateInfoVideoVisibility(screenId) {
    const videoWrapper = document.getElementById('info-video');
    if (!videoWrapper) return;

    const shouldShow = screenId === 'info-screen';
    videoWrapper.classList.toggle('is-visible', shouldShow);

    const video = videoWrapper.querySelector('video');
    if (!video) return;

    if (shouldShow) {
        if (!updateInfoVideoVisibility.wasActive) {
            video.currentTime = 0;
            scheduleInfoVideoOverlay();
        }
        updateInfoVideoVisibility.wasActive = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    } else if (updateInfoVideoVisibility.wasActive) {
        video.pause();
        video.currentTime = 0;
        updateInfoVideoVisibility.wasActive = false;
        resetInfoVideoOverlay();
    }
}

updateInfoVideoVisibility.wasActive = false;

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

// 영상 오버레이 비활성화 (HubSpot 랜딩과 동일 - 영상 자체에 텍스트 포함)
function scheduleMainVideoOverlay() {
    return;
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

    video.playbackRate = 1;
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

    const shouldShow = screenId === 'survey-screen';
    videoWrapper.classList.toggle('is-visible', shouldShow);

    const video = videoWrapper.querySelector('video');
    if (!video) return;

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

// 영상 오버레이 비활성화 (HubSpot 랜딩과 동일)
function scheduleSurveyVideoOverlay() {
    return;
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

    video.playbackRate = 1;
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

// 경품추첨 영상 관리
function updateLotteryVideoVisibility(screenId) {
    const videoWrapper = document.getElementById('lottery-video');
    if (!videoWrapper) return;

    const shouldShow = screenId === 'lottery-screen';
    videoWrapper.classList.toggle('is-visible', shouldShow);

    const video = videoWrapper.querySelector('video');
    if (!video) return;

    if (shouldShow) {
        if (!updateLotteryVideoVisibility.wasActive) {
            video.currentTime = 0;
            scheduleLotteryVideoOverlay();
        }
        updateLotteryVideoVisibility.wasActive = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    } else if (updateLotteryVideoVisibility.wasActive) {
        video.pause();
        video.currentTime = 0;
        updateLotteryVideoVisibility.wasActive = false;
        resetLotteryVideoOverlay();
    }
}

updateLotteryVideoVisibility.wasActive = false;

// 영상 오버레이 비활성화 (HubSpot 랜딩과 동일)
function scheduleLotteryVideoOverlay() {
    return;
}

function resetLotteryVideoOverlay() {
    const videoWrapper = document.getElementById('lottery-video');
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
    resetLotteryVideoTyping();
}

function resetLotteryVideoTyping() {
    const overlay = document.querySelector('#lottery-video .lottery-video-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-typing');
    const lines = overlay.querySelectorAll('.lottery-video-line');
    lines.forEach(line => {
        line.style.animationDelay = '0ms';
    });
}

function startLotteryVideoTyping() {
    const overlay = document.querySelector('#lottery-video .lottery-video-overlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.lottery-video-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * TEXT_LINE_INTERVAL_MS}ms`;
    });
    overlay.classList.add('is-typing');
}

function getLotteryVideoTypingDuration() {
    const overlay = document.querySelector('#lottery-video .lottery-video-overlay');
    if (!overlay) return 0;
    const lineCount = overlay.querySelectorAll('.lottery-video-line').length;
    if (lineCount === 0) return 0;
    return (lineCount - 1) * TEXT_LINE_INTERVAL_MS + 800;
}

function initLotteryVideoPlayback() {
    const videoWrapper = document.getElementById('lottery-video');
    const video = videoWrapper?.querySelector('video');
    if (!videoWrapper || !video) return;

    video.playbackRate = 1;
    video.loop = false;
    video.addEventListener('ended', () => {
        if (!updateLotteryVideoVisibility.wasActive) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
        scheduleLotteryVideoOverlay();
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
        return document.getElementById('info-video');
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

/** 하단 탭(세션/기능, 내정보, 설정) 활성 상태 동기화 */
function updateBottomNavActive(screenId) {
    const tabMap = {
        'demo-screen': 'session',
        'myinfo-screen': 'myinfo',
        'networking-screen': 'networking',
        'settings-screen': 'settings'
    };
    const activeTab = tabMap[screenId] || null;
    document.querySelectorAll('.bottom-nav').forEach(nav => {
        nav.querySelectorAll('.bottom-nav-item').forEach(item => {
            const tab = item.getAttribute('data-tab');
            const isActive = tab === activeTab;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-current', isActive ? 'page' : null);
        });
    });
}

/** 하단 탭 클릭 시 화면 전환 */
function initBottomNav() {
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            const screenMap = { session: 'demo-screen', myinfo: 'myinfo-screen', networking: 'networking-screen', settings: 'settings-screen' };
            const screenId = screenMap[tab];
            if (screenId) {
                ScreenManager.show(screenId, { skipHistory: true });
                ScreenManager.screenHistory = [screenId];
            }
        });
    });
}

/** 네트워킹 화면: 필터 모달, 정렬/직무/연차, 페이지네이션, 참여하기 */
function initNetworkingTabs() {
    const screen = document.getElementById('networking-screen');
    if (!screen) return;

    const modal = screen.querySelector('#networking-filter-modal');
    const filterBtn = screen.querySelector('.networking-filter-btn');
    const backdrop = screen.querySelector('.networking-filter-backdrop');
    const applyBtn = screen.querySelector('.networking-filter-apply');
    const resetBtn = screen.querySelector('.networking-filter-reset');
    const sortOptions = screen.querySelectorAll('.networking-sort-option');
    const jobTags = screen.querySelectorAll('.networking-job-tag');
    const careerMin = screen.querySelector('#networking-career-min');
    const careerMax = screen.querySelector('#networking-career-max');
    const careerRangeText = screen.querySelector('#networking-career-range');
    const careerTrackFill = screen.querySelector('#networking-career-track-fill');
    const joinBtn = screen.querySelector('.networking-join-btn');

    function openFilterModal() {
        if (!modal) return;
        modal.hidden = false;
        requestAnimationFrame(() => {
            modal.classList.add('is-open');
        });
    }

    function closeFilterModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        const panel = modal.querySelector('.networking-filter-panel');
        const onEnd = () => {
            modal.hidden = true;
            if (panel) panel.removeEventListener('transitionend', onEnd);
        };
        if (panel) panel.addEventListener('transitionend', onEnd);
        if (!panel) modal.hidden = true;
    }

    function formatCareerLabel(val) {
        const n = parseInt(val, 10);
        if (n === 0) return '경력 없음';
        if (n >= 15) return '15년 이상';
        return n + '년';
    }

    function updateCareerRangeText() {
        if (!careerRangeText || !careerMin || !careerMax) return;
        let minVal = parseInt(careerMin.value, 10);
        let maxVal = parseInt(careerMax.value, 10);
        if (minVal > maxVal) {
            careerMin.value = maxVal;
            careerMax.value = minVal;
            minVal = maxVal;
            maxVal = parseInt(careerMax.value, 10);
        }
        const min = Math.min(parseInt(careerMin.value, 10), parseInt(careerMax.value, 10));
        const max = Math.max(parseInt(careerMin.value, 10), parseInt(careerMax.value, 10));
        careerRangeText.textContent = formatCareerLabel(String(min)) + ' ~ ' + formatCareerLabel(String(max));
        updateCareerTrackFill(min, max);
    }

    function updateCareerTrackFill(min, max) {
        if (!careerTrackFill) return;
        const MIN = 0;
        const MAX = 15;
        const left = (min / MAX) * 100;
        const width = ((max - min) / MAX) * 100;
        careerTrackFill.style.left = left + '%';
        careerTrackFill.style.width = width + '%';
    }

    function resetFilter() {
        sortOptions.forEach((opt, i) => {
            opt.classList.toggle('is-active', i === 0);
        });
        jobTags.forEach(tag => tag.classList.remove('is-selected'));
        if (careerMin) careerMin.value = '0';
        if (careerMax) careerMax.value = '15';
        updateCareerRangeText();
    }

    screen.querySelectorAll('.networking-filter-btn').forEach(btn => {
        btn.addEventListener('click', openFilterModal);
    });
    if (backdrop) backdrop.addEventListener('click', closeFilterModal);
    if (applyBtn) applyBtn.addEventListener('click', closeFilterModal);
    if (resetBtn) resetBtn.addEventListener('click', resetFilter);

    sortOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            sortOptions.forEach(o => o.classList.remove('is-active'));
            opt.classList.add('is-active');
        });
    });

    jobTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('is-selected');
        });
    });

    if (careerMin) {
        careerMin.addEventListener('input', () => {
            const maxVal = parseInt(careerMax.value, 10);
            if (parseInt(careerMin.value, 10) > maxVal) careerMin.value = maxVal;
            updateCareerRangeText();
        });
    }
    if (careerMax) {
        careerMax.addEventListener('input', () => {
            const minVal = parseInt(careerMin.value, 10);
            if (parseInt(careerMax.value, 10) < minVal) careerMax.value = minVal;
            updateCareerRangeText();
        });
    }
    updateCareerRangeText();

    let currentPage = 1;
    screen.addEventListener('click', (e) => {
        const prev = e.target.closest('.networking-pagination-prev');
        const next = e.target.closest('.networking-pagination-next');
        const block = prev || next;
        if (!block) return;
        const container = block.closest('.networking-content');
        const currentEl = container && container.querySelector('.networking-pagination-current');
        if (prev && currentPage > 1) {
            currentPage--;
            if (currentEl) currentEl.textContent = currentPage;
        } else if (next) {
            currentPage++;
            if (currentEl) currentEl.textContent = currentPage;
        }
    });

    /* 네트워킹 참여하기 모달 */
    const joinModal = screen.querySelector('#networking-join-modal');
    const joinClose = joinModal && joinModal.querySelector('.networking-join-close');
    const joinBackdrop = joinModal && joinModal.querySelector('.networking-join-backdrop');
    const joinCancel = screen.querySelector('.networking-join-cancel');
    const joinSubmit = screen.querySelector('.networking-join-submit');
    const joinJobTags = screen.querySelectorAll('.networking-join-job-tag');

    /** 프로필 이미지: 세션 동안 유지, 모달 닫았다 열어도 유지 (서버 전송 없음) */
    let networkingProfilePhotoUrl = null;
    const joinPhotoWrap = joinModal && joinModal.querySelector('.networking-join-photo-wrap');
    const joinPhotoInput = joinModal && joinModal.querySelector('.networking-join-photo-input');
    const joinPhotoPreview = joinPhotoWrap && joinPhotoWrap.querySelector('.networking-join-photo-preview');
    const joinPhotoPlaceholder = joinPhotoWrap && joinPhotoWrap.querySelector('.networking-join-photo-placeholder');

    function applyProfilePhotoToWrap(wrap, previewEl, placeholderEl, url) {
        if (!wrap || !previewEl || !placeholderEl) return;
        if (url) {
            previewEl.src = url;
            previewEl.style.display = 'block';
            placeholderEl.style.visibility = 'hidden';
            placeholderEl.setAttribute('aria-hidden', 'true');
            wrap.classList.add('has-image');
        } else {
            previewEl.removeAttribute('src');
            previewEl.style.display = 'none';
            placeholderEl.style.visibility = '';
            placeholderEl.setAttribute('aria-hidden', 'false');
            wrap.classList.remove('has-image');
        }
    }

    /** 이미지 잘라내기 모달: 파일 선택 시 크롭 모달만 열고, 확인 시에만 프로필에 반영 */
    const cropModal = screen.querySelector('#crop-modal');
    const cropModalImg = cropModal && cropModal.querySelector('#crop-modal-img');
    const cropModalCloseBtn = cropModal && cropModal.querySelector('.crop-modal-close');
    const cropModalConfirmBtn = cropModal && cropModal.querySelector('.crop-modal-confirm');
    const cropModalBackdrop = cropModal && cropModal.querySelector('.crop-modal-backdrop');
    let cropModalTempUrl = null;
    let cropModalCropper = null;

    function openCropModal(objectUrl) {
        if (!cropModal || !cropModalImg || typeof Cropper === 'undefined') return;
        closeCropModal();
        cropModalTempUrl = objectUrl;
        cropModalImg.src = objectUrl;
        cropModal.hidden = false;
        cropModal.classList.add('is-open');
        cropModalImg.onload = function onCropImgLoad() {
            cropModalImg.onload = null;
            if (cropModalCropper) {
                cropModalCropper.destroy();
                cropModalCropper = null;
            }
            cropModalCropper = new Cropper(cropModalImg, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false
            });
        };
    }

    function closeCropModal() {
        if (cropModalCropper) {
            cropModalCropper.destroy();
            cropModalCropper = null;
        }
        if (cropModalTempUrl) {
            URL.revokeObjectURL(cropModalTempUrl);
            cropModalTempUrl = null;
        }
        if (cropModalImg) cropModalImg.removeAttribute('src');
        if (cropModal) {
            cropModal.hidden = true;
            cropModal.classList.remove('is-open');
        }
    }

    function handleProfilePhotoFile(inputEl, wrap, previewEl, placeholderEl) {
        const file = inputEl && inputEl.files && inputEl.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        const tempUrl = URL.createObjectURL(file);
        inputEl.value = '';
        openCropModal(tempUrl);
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            if (joinModal) {
                joinModal.hidden = false;
                joinModal.classList.add('is-open');
                applyProfilePhotoToWrap(joinPhotoWrap, joinPhotoPreview, joinPhotoPlaceholder, networkingProfilePhotoUrl);
                applyNamecardColor(networkingNamecardColor);
            }
        });
    }

    if (cropModalCloseBtn) cropModalCloseBtn.addEventListener('click', closeCropModal);
    if (cropModalBackdrop) cropModalBackdrop.addEventListener('click', closeCropModal);
    if (cropModalConfirmBtn) {
        cropModalConfirmBtn.addEventListener('click', function onCropConfirm() {
            if (!cropModalCropper) return;
            const canvas = cropModalCropper.getCroppedCanvas({ maxWidth: 1024, maxHeight: 1024 });
            if (!canvas) return;
            canvas.toBlob(function (blob) {
                if (!blob) return;
                if (networkingProfilePhotoUrl) URL.revokeObjectURL(networkingProfilePhotoUrl);
                networkingProfilePhotoUrl = URL.createObjectURL(blob);
                applyProfilePhotoToWrap(joinPhotoWrap, joinPhotoPreview, joinPhotoPlaceholder, networkingProfilePhotoUrl);
                applyProfilePhotoToWrap(editPhotoWrap, editPhotoPreview, editPhotoPlaceholder, networkingProfilePhotoUrl);
                closeCropModal();
            }, 'image/jpeg', 0.92);
        });
    }

    if (joinPhotoWrap && joinPhotoInput) {
        const joinUploadBtn = joinPhotoWrap.querySelector('.networking-join-upload');
        if (joinUploadBtn) joinUploadBtn.addEventListener('click', () => joinPhotoInput.click());
        joinPhotoInput.addEventListener('change', () => handleProfilePhotoFile(joinPhotoInput, joinPhotoWrap, joinPhotoPreview, joinPhotoPlaceholder));
    }

    function closeJoinModal() {
        if (!joinModal) return;
        joinModal.hidden = true;
        joinModal.classList.remove('is-open');
    }

    if (joinClose) joinClose.addEventListener('click', closeJoinModal);
    if (joinBackdrop) joinBackdrop.addEventListener('click', closeJoinModal);
    if (joinCancel) joinCancel.addEventListener('click', closeJoinModal);
    const beforeJoin = screen.querySelector('#networking-before-join');
    const afterJoin = screen.querySelector('#networking-after-join');
    const listAfter = screen.querySelector('#networking-list-after');
    const afterJoinCountEl = afterJoin && afterJoin.querySelector('.networking-count');
    const afterJoinSearchInput = afterJoin && afterJoin.querySelector('.networking-search-input');

    function getSearchableText(card) {
        var nameEl = card.querySelector('.networking-profile-name');
        var roleEl = card.querySelector('.networking-profile-role');
        var introEl = card.querySelector('.networking-profile-intro');
        var tagsEl = card.querySelector('.networking-profile-tags');
        var name = nameEl ? nameEl.textContent.replace(/\s*\(나\)\s*/g, '').replace(/\s*verified\s*/gi, '').trim() : '';
        var role = roleEl ? roleEl.textContent.trim() : '';
        var intro = introEl ? introEl.textContent.trim() : '';
        var tags = tagsEl ? tagsEl.textContent.trim() : '';
        var dataStr = (card.dataset.affiliation || '') + ' ' + (card.dataset.title || '') + ' ' + (card.dataset.department || '') + ' ' + (card.dataset.career || '') + ' ' + (card.dataset.jobs || '');
        return (name + ' ' + role + ' ' + intro + ' ' + tags + ' ' + dataStr).toLowerCase();
    }

    function filterListAfterBySearch() {
        if (!listAfter || !afterJoinSearchInput) return;
        var query = (afterJoinSearchInput.value || '').trim().toLowerCase();
        var cards = listAfter.querySelectorAll('.networking-profile-card');
        cards.forEach(function (card) {
            var searchable = getSearchableText(card);
            var match = !query || searchable.indexOf(query) !== -1;
            card.style.display = match ? '' : 'none';
        });
    }

    if (afterJoinSearchInput) {
        afterJoinSearchInput.addEventListener('input', filterListAfterBySearch);
        afterJoinSearchInput.addEventListener('search', filterListAfterBySearch);
    }

    function getJoinFormData() {
        if (!joinModal) return null;
        const nameEl = joinModal.querySelector('.networking-join-team');
        const name = nameEl ? (nameEl.childNodes[0] && nameEl.childNodes[0].nodeType === Node.TEXT_NODE ? nameEl.childNodes[0].textContent : nameEl.textContent).replace(/\s*verified\s*/gi, '').trim() : '참가자';
        const bodyInner = joinModal.querySelector('.networking-join-body-inner');
        const rows = bodyInner ? bodyInner.querySelectorAll('.networking-join-row') : [];
        const affiliationInput = rows[0] ? rows[0].querySelectorAll('.networking-join-input')[0] : null;
        const titleInput = rows[0] ? rows[0].querySelectorAll('.networking-join-input')[1] : null;
        const affiliation = affiliationInput ? affiliationInput.value.trim() : '';
        const title = titleInput ? titleInput.value.trim() : '';
        const role = affiliation + (title ? ' / ' + title : '');
        const introEl = joinModal.querySelector('.networking-join-textarea');
        const intro = introEl ? introEl.value.trim() : '';
        const selectedTags = joinModal.querySelectorAll('.networking-join-job-tag.is-selected .networking-join-job-text');
        const tags = Array.from(selectedTags).map(function (t) { return t.textContent.trim(); }).filter(Boolean);
        const avatarLetter = name ? name.charAt(0) : '?';
        const deptInput = rows[1] ? rows[1].querySelectorAll('.networking-join-input')[0] : null;
        const careerWrap = rows[1] ? rows[1].querySelector('.networking-join-select-wrap') : null;
        const career = careerWrap && careerWrap.querySelector('span') ? careerWrap.querySelector('span').textContent.trim() : '';
        const linkInputs = bodyInner ? bodyInner.querySelectorAll('input[type="url"]') : [];
        const linkedin = linkInputs[0] ? linkInputs[0].value.trim() : '';
        const remember = linkInputs[1] ? linkInputs[1].value.trim() : '';
        return { name: name || '참가자', role, intro, tags, avatarLetter, affiliation, title, department: deptInput ? deptInput.value.trim() : '', career, linkedin, remember };
    }

    function addMyCardToTop() {
        if (!listAfter) return;
        const data = getJoinFormData();
        if (!data) return;
        const existingMe = listAfter.querySelector('.networking-profile-card.is-me');
        if (existingMe) existingMe.remove();
        const avatarEl = document.createElement('div');
        avatarEl.className = 'networking-profile-avatar';
        if (networkingProfilePhotoUrl) {
            avatarEl.classList.add('has-photo');
            avatarEl.style.backgroundImage = 'url("' + networkingProfilePhotoUrl.replace(/"/g, '\\"') + '")';
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.style.backgroundPosition = 'center';
            avatarEl.textContent = '';
            avatarEl.classList.remove('networking-profile-avatar-no-photo');
        } else {
            avatarEl.classList.add('networking-profile-avatar-no-photo');
            avatarEl.textContent = data.avatarLetter;
            avatarEl.style.backgroundImage = '';
        }
        const tagsHtml = data.tags.length ? '<div class="networking-profile-tags">' + data.tags.map(function (t) { return '<span class="networking-tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>' : '';
        const li = document.createElement('li');
        li.className = 'networking-profile-card is-me';
        li.dataset.affiliation = data.affiliation || '';
        li.dataset.title = data.title || '';
        li.dataset.department = data.department || '';
        li.dataset.career = data.career || '';
        li.dataset.jobs = (data.tags || []).join(', ');
        li.dataset.linkedin = data.linkedin || '';
        li.dataset.remember = data.remember || '';
        li.dataset.color = networkingNamecardColor || '#178263';
        li.dataset.photo = networkingProfilePhotoUrl || '';
        li.innerHTML =
            '<div class="networking-profile-body">' +
            '<p class="networking-profile-name">' + escapeHtml(data.name) + ' <span class="networking-profile-badge">(나)</span></p>' +
            '<p class="networking-profile-role">' + escapeHtml(data.role) + '</p>' +
            (data.intro ? '<p class="networking-profile-intro">' + escapeHtml(data.intro) + '</p>' : '') +
            tagsHtml +
            '</div>';
        li.insertBefore(avatarEl, li.firstChild);
        listAfter.insertBefore(li, listAfter.firstChild);
        if (afterJoinCountEl) afterJoinCountEl.textContent = listAfter.children.length + '명 참여중';
        filterListAfterBySearch();
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    if (joinSubmit) {
        joinSubmit.addEventListener('click', () => {
            closeJoinModal();
            if (beforeJoin) beforeJoin.hidden = true;
            if (afterJoin) afterJoin.hidden = false;
            addMyCardToTop();
        });
    }

    /* 참가자 상세 정보 모달 */
    const participantDetailModal = screen.querySelector('#participant-detail-modal');
    const participantDetailBackdrop = participantDetailModal && participantDetailModal.querySelector('.participant-detail-backdrop');
    const participantDetailClose = participantDetailModal && participantDetailModal.querySelector('.participant-detail-close');
    const participantDetailHeader = participantDetailModal && participantDetailModal.querySelector('.participant-detail-header');
    const participantDetailPhoto = participantDetailModal && participantDetailModal.querySelector('#participant-detail-photo');
    const participantDetailPhotoWrap = participantDetailModal && participantDetailModal.querySelector('.participant-detail-photo-wrap');
    const participantDetailPhotoPlaceholder = participantDetailModal && participantDetailModal.querySelector('#participant-detail-photo-placeholder');
    const participantDetailName = participantDetailModal && participantDetailModal.querySelector('#participant-detail-name');
    const participantDetailRole = participantDetailModal && participantDetailModal.querySelector('#participant-detail-role');
    const participantDetailIntro = participantDetailModal && participantDetailModal.querySelector('#participant-detail-intro');
    const participantDetailAffiliation = participantDetailModal && participantDetailModal.querySelector('#participant-detail-affiliation');
    const participantDetailTitle = participantDetailModal && participantDetailModal.querySelector('#participant-detail-title');
    const participantDetailDepartment = participantDetailModal && participantDetailModal.querySelector('#participant-detail-department');
    const participantDetailCareer = participantDetailModal && participantDetailModal.querySelector('#participant-detail-career');
    const participantDetailJobs = participantDetailModal && participantDetailModal.querySelector('#participant-detail-jobs');
    const participantDetailLinkedin = participantDetailModal && participantDetailModal.querySelector('#participant-detail-linkedin');
    const participantDetailRemember = participantDetailModal && participantDetailModal.querySelector('#participant-detail-remember');

    function openParticipantDetail(card) {
        if (!participantDetailModal || !card) return;
        const nameEl = card.querySelector('.networking-profile-name');
        const roleEl = card.querySelector('.networking-profile-role');
        const introEl = card.querySelector('.networking-profile-intro');
        const name = nameEl ? nameEl.textContent.replace(/\s*\(나\)\s*/g, '').replace(/\s*verified\s*/gi, '').trim() : '';
        const role = roleEl ? roleEl.textContent.trim() : '';
        const intro = introEl ? introEl.textContent.trim() : '';
        const affiliation = card.dataset.affiliation || '';
        const title = card.dataset.title || '';
        const department = card.dataset.department || '';
        const career = card.dataset.career || '';
        const jobs = card.dataset.jobs || '';
        const linkedin = card.dataset.linkedin || '';
        const remember = card.dataset.remember || '';
        const color = card.dataset.color || '#178263';
        const avatarEl = card.querySelector('.networking-profile-avatar');
        let photoUrl = card.dataset.photo || '';
        if (!photoUrl && avatarEl && avatarEl.style.backgroundImage) {
            photoUrl = avatarEl.style.backgroundImage.replace(/^url\(["']?|["']?\)$/g, '');
        }
        if (participantDetailHeader) participantDetailHeader.style.backgroundColor = color;
        if (participantDetailPhotoWrap) participantDetailPhotoWrap.classList.toggle('has-image', !!photoUrl);
        if (participantDetailPhotoPlaceholder) participantDetailPhotoPlaceholder.textContent = name ? name.charAt(0) : '';
        if (participantDetailPhoto) {
            if (photoUrl) {
                participantDetailPhoto.src = photoUrl;
                participantDetailPhoto.alt = name;
            } else {
                participantDetailPhoto.removeAttribute('src');
            }
        }
        if (participantDetailName) {
            participantDetailName.innerHTML = escapeHtml(name) + ' <span class="material-icons participant-detail-verified" aria-hidden="true" title="인증됨">verified</span>';
        }
        if (participantDetailRole) participantDetailRole.textContent = role;
        if (participantDetailIntro) participantDetailIntro.textContent = intro || '—';
        if (participantDetailAffiliation) participantDetailAffiliation.textContent = affiliation || '—';
        if (participantDetailTitle) participantDetailTitle.textContent = title || '—';
        if (participantDetailDepartment) participantDetailDepartment.textContent = department || '—';
        if (participantDetailCareer) participantDetailCareer.textContent = career || '—';
        if (participantDetailJobs) participantDetailJobs.textContent = jobs || '—';
        if (participantDetailLinkedin) {
            if (linkedin) {
                participantDetailLinkedin.innerHTML = '<a href="' + escapeHtml(linkedin) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(linkedin) + '</a>';
            } else {
                participantDetailLinkedin.textContent = '없음';
            }
        }
        if (participantDetailRemember) {
            if (remember) {
                participantDetailRemember.innerHTML = '<a href="' + escapeHtml(remember) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(remember) + '</a>';
            } else {
                participantDetailRemember.textContent = '없음';
            }
        }
        participantDetailModal.hidden = false;
        participantDetailModal.classList.add('is-open');
    }

    function closeParticipantDetail() {
        if (!participantDetailModal) return;
        participantDetailModal.hidden = true;
        participantDetailModal.classList.remove('is-open');
    }

    if (participantDetailClose) participantDetailClose.addEventListener('click', closeParticipantDetail);
    if (participantDetailBackdrop) participantDetailBackdrop.addEventListener('click', closeParticipantDetail);
    if (listAfter) {
        listAfter.addEventListener('click', function (e) {
            const card = e.target.closest('.networking-profile-card');
            if (!card) return;
            openParticipantDetail(card);
        });
    }

    joinJobTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('is-selected');
        });
    });

    /* 내 정보 수정하기 버튼 → 수정 모달 열기 */
    const editMyinfoBtn = screen.querySelector('.networking-edit-myinfo-btn');
    const editModal = screen.querySelector('#networking-edit-modal');
    const editClose = screen.querySelector('.networking-edit-close');
    const editBackdrop = editModal && editModal.querySelector('.networking-join-backdrop');
    const editCancel = screen.querySelector('.networking-edit-cancel');
    const editSave = screen.querySelector('.networking-edit-save');
    const editJobTags = screen.querySelectorAll('.networking-edit-jobs .networking-join-job-tag');

    function closeEditModal() {
        if (!editModal) return;
        editModal.hidden = true;
        editModal.classList.remove('is-open');
    }

    const editPhotoWrap = editModal && editModal.querySelector('.networking-join-photo-wrap');
    const editPhotoInput = editModal && editModal.querySelector('.networking-join-photo-input');
    const editPhotoPreview = editPhotoWrap && editPhotoWrap.querySelector('.networking-join-photo-preview');
    const editPhotoPlaceholder = editPhotoWrap && editPhotoWrap.querySelector('.networking-join-photo-placeholder');

    /** 네임카드 배경색: 세션 동안 유지, 참여하기 시 전달용 */
    let networkingNamecardColor = '#178263';
    const joinProfile = joinModal && joinModal.querySelector('.networking-join-profile');
    const editProfile = editModal && editModal.querySelector('.networking-join-profile');
    const joinColorField = joinModal && joinModal.querySelector('.networking-join-color-field');
    const editColorField = editModal && editModal.querySelector('.networking-join-color-field');

    function applyNamecardColor(hex) {
        if (joinProfile) joinProfile.style.backgroundColor = hex;
        if (editProfile) editProfile.style.backgroundColor = hex;
        [joinColorField, editColorField].forEach(function (field) {
            if (!field) return;
            const swatch = field.querySelector('.networking-join-color-swatch');
            const valueEl = field.querySelector('.networking-join-color-value');
            if (swatch) swatch.style.backgroundColor = hex;
            if (valueEl) valueEl.textContent = hex;
        });
    }

    function hexToHsl(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length !== 6) return { h: 164, s: 70, l: 30 };
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    function hslToHex(h, s, l) {
        h = h / 360; s = s / 100; l = l / 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = function (p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return '#' + [r, g, b].map(function (x) {
            const n = Math.round(x * 255);
            return (n < 16 ? '0' : '') + n.toString(16);
        }).join('');
    }

    function initColorPicker(field, profileEl) {
        if (!field || !profileEl) return;
        const panel = field.querySelector('.networking-join-color-picker-panel');
        const wrap = field.querySelector('.networking-join-color-wrap');
        const palette = field.querySelector('.color-picker-palette');
        const paletteHandle = field.querySelector('.color-picker-palette-handle');
        const hueEl = field.querySelector('.color-picker-hue');
        const hueHandle = field.querySelector('.color-picker-hue-handle');
        const hexInput = field.querySelector('.color-picker-hex');
        const confirmBtn = field.querySelector('.color-picker-confirm');
        if (!panel || !wrap || !palette || !paletteHandle || !hueEl || !hueHandle || !hexInput || !confirmBtn) return;

        let h = 164, s = 70, l = 30;
        let paletteDragging = false, hueDragging = false;

        function syncFromHsl() {
            const hex = hslToHex(h, s, l);
            palette.style.setProperty('--picker-hue', String(h));
            paletteHandle.style.left = (s) + '%';
            paletteHandle.style.top = (100 - l) + '%';
            hueHandle.style.top = (100 - (h / 360) * 100) + '%';
            hexInput.value = hex;
            if (profileEl) profileEl.style.backgroundColor = hex;
        }
        function openPanel() {
            const hsl = hexToHsl(networkingNamecardColor);
            h = hsl.h; s = hsl.s; l = hsl.l;
            hexInput.value = networkingNamecardColor;
            panel.hidden = false;
            wrap.setAttribute('aria-expanded', 'true');
            syncFromHsl();
        }
        function closePanel() {
            panel.hidden = true;
            wrap.setAttribute('aria-expanded', 'false');
        }

        wrap.addEventListener('click', function () {
            if (panel.hidden) openPanel();
            else closePanel();
        });

        function onPaletteMove(clientX, clientY) {
            const rect = palette.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
            s = Math.round(x * 100);
            l = Math.round((1 - y) * 100);
            syncFromHsl();
        }
        function onHueMove(clientY) {
            const rect = hueEl.getBoundingClientRect();
            const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
            h = Math.round((1 - y) * 360);
            syncFromHsl();
        }
        function onPointerUp() {
            paletteDragging = false;
            hueDragging = false;
            document.removeEventListener('mousemove', onDocMove);
            document.removeEventListener('mouseup', onPointerUp);
            document.removeEventListener('touchmove', onDocTouch, { passive: false });
            document.removeEventListener('touchend', onPointerUp);
        }
        function onDocMove(e) {
            if (paletteDragging) onPaletteMove(e.clientX, e.clientY);
            if (hueDragging) onHueMove(e.clientY);
        }
        function onDocTouch(e) {
            if (e.touches.length === 0) return;
            if (paletteDragging) onPaletteMove(e.touches[0].clientX, e.touches[0].clientY);
            if (hueDragging) onHueMove(e.touches[0].clientY);
            e.preventDefault();
        }
        palette.addEventListener('mousedown', function (e) {
            e.preventDefault();
            paletteDragging = true;
            onPaletteMove(e.clientX, e.clientY);
            document.addEventListener('mousemove', onDocMove);
            document.addEventListener('mouseup', onPointerUp);
        });
        palette.addEventListener('touchstart', function (e) {
            if (e.touches.length === 0) return;
            paletteDragging = true;
            onPaletteMove(e.touches[0].clientX, e.touches[0].clientY);
            document.addEventListener('touchmove', onDocTouch, { passive: false });
            document.addEventListener('touchend', onPointerUp);
        });
        hueEl.addEventListener('mousedown', function (e) {
            e.preventDefault();
            hueDragging = true;
            onHueMove(e.clientY);
            document.addEventListener('mousemove', onDocMove);
            document.addEventListener('mouseup', onPointerUp);
        });
        hueEl.addEventListener('touchstart', function (e) {
            if (e.touches.length === 0) return;
            hueDragging = true;
            onHueMove(e.touches[0].clientY);
            document.addEventListener('touchmove', onDocTouch, { passive: false });
            document.addEventListener('touchend', onPointerUp);
        });
        hexInput.addEventListener('input', function () {
            let hex = hexInput.value.trim();
            if (hex && !hex.startsWith('#')) hex = '#' + hex;
            if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                const hsl = hexToHsl(hex);
                h = hsl.h; s = hsl.s; l = hsl.l;
                syncFromHsl();
            }
        });
        confirmBtn.addEventListener('click', function () {
            let hex = hexInput.value.trim();
            if (hex && !hex.startsWith('#')) hex = '#' + hex;
            if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) hex = hslToHex(h, s, l);
            networkingNamecardColor = hex;
            applyNamecardColor(hex);
            closePanel();
        });
    }
    initColorPicker(joinColorField, joinProfile);
    initColorPicker(editColorField, editProfile);

    if (editMyinfoBtn) {
        editMyinfoBtn.addEventListener('click', () => {
            if (editModal) {
                editModal.hidden = false;
                editModal.classList.add('is-open');
                applyProfilePhotoToWrap(editPhotoWrap, editPhotoPreview, editPhotoPlaceholder, networkingProfilePhotoUrl);
                applyNamecardColor(networkingNamecardColor);
            }
        });
    }
    if (editPhotoWrap && editPhotoInput) {
        const editUploadBtn = editPhotoWrap.querySelector('.networking-join-upload');
        if (editUploadBtn) editUploadBtn.addEventListener('click', () => editPhotoInput.click());
        editPhotoInput.addEventListener('change', () => handleProfilePhotoFile(editPhotoInput, editPhotoWrap, editPhotoPreview, editPhotoPlaceholder));
    }
    if (editClose) editClose.addEventListener('click', closeEditModal);
    if (editBackdrop) editBackdrop.addEventListener('click', closeEditModal);
    if (editCancel) editCancel.addEventListener('click', closeEditModal);
    if (editSave) editSave.addEventListener('click', closeEditModal);

    editJobTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('is-selected');
        });
    });
}

/** 내정보 화면 내 서브탭(QR, 내정보, 참여기록) 전환 */
function initMyinfoTabs() {
    const screen = document.getElementById('myinfo-screen');
    if (!screen) return;
    const tabs = screen.querySelectorAll('.myinfo-tab');
    const panels = screen.querySelectorAll('.myinfo-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.getAttribute('data-myinfo-tab');
            tabs.forEach(t => {
                t.classList.toggle('is-active', t === tab);
                t.setAttribute('aria-selected', t === tab);
            });
            panels.forEach(panel => {
                const id = panel.id;
                const isActive = id === 'myinfo-panel-' + key;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
            });
        });
    });
}

function initMyinfoPdfModal() {
    const modal = document.getElementById('myinfo-pdf-modal');
    const openBtn = document.querySelector('.myinfo-pdf-btn');
    const cancelBtn = document.getElementById('myinfo-pdf-modal-cancel');
    const submitBtn = document.getElementById('myinfo-pdf-modal-submit');
    const backdrop = modal && modal.querySelector('.myinfo-pdf-modal-backdrop');

    function openPdfModal() {
        if (!modal) return;
        modal.hidden = false;
        modal.classList.add('is-open');
    }

    function closePdfModal() {
        if (!modal) return;
        modal.hidden = true;
        modal.classList.remove('is-open');
    }

    if (openBtn) openBtn.addEventListener('click', openPdfModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closePdfModal);
    if (submitBtn) submitBtn.addEventListener('click', () => {
        closePdfModal();
        // 데모: 실제 내보내기 없음
    });
    if (backdrop) backdrop.addEventListener('click', closePdfModal);
}

// 영상 오버레이 비활성화 (HubSpot 랜딩과 동일)
function scheduleQnaVideoOverlay() {
    return;
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

    video.playbackRate = 1;
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

// 영상 오버레이 비활성화 (HubSpot 랜딩과 동일)
function scheduleInfoVideoOverlay() {
    return;
}

function resetInfoVideoOverlay() {
    const videoWrapper = document.getElementById('info-video');
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
    resetInfoVideoTyping();
}

function resetInfoVideoTyping() {
    const overlay = document.querySelector('#info-video .info-video-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-typing');
    const lines = overlay.querySelectorAll('.info-video-line');
    lines.forEach(line => {
        line.style.animationDelay = '0ms';
    });
}

function startInfoVideoTyping() {
    const overlay = document.querySelector('#info-video .info-video-overlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.info-video-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * TEXT_LINE_INTERVAL_MS}ms`;
    });
    overlay.classList.add('is-typing');
}

function getInfoVideoTypingDuration() {
    const overlay = document.querySelector('#info-video .info-video-overlay');
    if (!overlay) return 0;
    const lineCount = overlay.querySelectorAll('.info-video-line').length;
    if (lineCount === 0) return 0;
    return (lineCount - 1) * TEXT_LINE_INTERVAL_MS + 800;
}

function initInfoVideoPlayback() {
    const videoWrapper = document.getElementById('info-video');
    const video = videoWrapper?.querySelector('video');
    if (!videoWrapper || !video) return;

    video.playbackRate = 1;
    video.loop = false;
    video.addEventListener('ended', () => {
        if (!updateInfoVideoVisibility.wasActive) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
        scheduleInfoVideoOverlay();
    });
}

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
    
    // 경품추첨 화면이면 로딩 애니메이션 시작
    if (screenId === 'lottery-screen') {
        setTimeout(() => initLotteryLoading(), 0);
    }
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
            // 로딩 애니메이션 시작
            setTimeout(() => initLotteryLoading(), 0);
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

// 경품추첨 로딩 애니메이션
let lotteryVisited = false;

function initLotteryLoading() {
    const loadingScreen = document.getElementById('lottery-loading');
    const resultScreen = document.getElementById('lottery-result');
    
    if (!loadingScreen || !resultScreen) return;
    
    // 이미 방문한 적 있으면 바로 결과 화면 표시
    if (lotteryVisited) {
        loadingScreen.style.display = 'none';
        resultScreen.style.display = '';
        return;
    }
    
    // 최초 방문: 로딩 화면 표시, 결과 화면 숨김
    loadingScreen.style.display = '';
    resultScreen.style.display = 'none';
    
    // 1초 후 결과 화면으로 전환
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        resultScreen.style.display = '';
        lotteryVisited = true;
    }, 1000);
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

/** 스크롤 시에만 우측 스크롤바 활성화 (.is-scrolling 토글) */
function initScrollbarOnScroll() {
    const SCROLLBAR_HIDE_MS = 1200;
    const scrollContainers = document.querySelectorAll('.phone-screen-inner, .networking-scroll-area');
    scrollContainers.forEach(el => {
        let hideTimer = null;
        el.addEventListener('scroll', () => {
            el.classList.add('is-scrolling');
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                el.classList.remove('is-scrolling');
                hideTimer = null;
            }, SCROLLBAR_HIDE_MS);
        }, { passive: true });
    });
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 데모 화면 초기화 (등록 없이 바로 접속)
    initDemoScreen();
    initScrollbarOnScroll();
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
    initInfoVideoPlayback();
    initQnaVideoPlayback();
    initMainVideoPlayback();
    initSurveyVideoPlayback();
    initLotteryVideoPlayback();
    initMobileHeaderMenus();
    initMobileMenu();
    initBottomNav();
    initNetworkingTabs();
    initMyinfoTabs();
    initMyinfoPdfModal();
    updateInfoVideoVisibility(ScreenManager.currentScreen);
    updateQnaVideoVisibility(ScreenManager.currentScreen);
    updateMainVideoVisibility(ScreenManager.currentScreen);
    updateSurveyVideoVisibility(ScreenManager.currentScreen);
    updateLotteryVideoVisibility(ScreenManager.currentScreen);
    
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
