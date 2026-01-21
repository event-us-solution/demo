// 페이지 및 말풍선 관리
let currentPage = 0;

// 화면 전환 관리
const ScreenManager = {
    currentScreen: 'demo-screen',
    screenHistory: ['demo-screen'],
    
    show(screenId) {
        document.querySelectorAll('.phone-screen-inner').forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.screenHistory.push(screenId);
            this.currentScreen = screenId;
        }
        
        // 화면 전환 시 말풍선 업데이트
        this.updateBalloons();
    },
    
    // 화면별 말풍선 업데이트
    updateBalloons() {
        // 모든 말풍선 숨김
        hideAllBalloons();
        
        // 현재 화면에 맞는 말풍선 표시
        if (this.currentScreen === 'demo-screen') {
            showMainBalloons();
        } else {
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
        if (this.screenHistory.length > 1) {
            this.screenHistory.pop(); // 현재 화면 제거
            const previousScreen = this.screenHistory[this.screenHistory.length - 1];
            this.show(previousScreen);
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
    
    if (mainBalloon1) mainBalloon1.style.display = 'flex';
    if (mainBalloon2) mainBalloon2.style.display = 'flex';
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
    if (feature === 'qna') {
        initQnaEmbed();
    }
    if (screenContent) {
        ScreenManager.updateScreen(screenContent);
    }
}

function initQnaEmbed() {
    const embed = document.querySelector('.qna-embed');
    const iframe = embed ? embed.querySelector('iframe') : null;
    if (!embed || !iframe) return;

    const initSrc = iframe.getAttribute('data-init-src');
    const targetSrc = iframe.getAttribute('data-target-src');
    const sessionKey = 'qnaSessionReady';

    let sessionReady = false;
    try {
        sessionReady = sessionStorage.getItem(sessionKey) === 'true';
    } catch (e) {
        sessionReady = false;
    }

    const clearLoadHandler = () => {
        if (iframe._qnaLoadHandler) {
            iframe.removeEventListener('load', iframe._qnaLoadHandler);
            iframe._qnaLoadHandler = null;
        }
    };

    const showTarget = () => {
        if (targetSrc && iframe.getAttribute('src') !== targetSrc) {
            iframe.setAttribute('src', targetSrc);
        }
        embed.classList.remove('is-loading');
    };

    embed.classList.add('is-loading');

    if (sessionReady) {
        clearLoadHandler();
        showTarget();
        return;
    }

    const onLoad = () => {
        clearLoadHandler();
        try {
            sessionStorage.setItem(sessionKey, 'true');
        } catch (e) {
            // ignore storage errors
        }
        showTarget();
    };

    clearLoadHandler();
    iframe._qnaLoadHandler = onLoad;
    iframe.addEventListener('load', onLoad, { once: true });
    if (initSrc && iframe.getAttribute('src') !== initSrc) {
        iframe.setAttribute('src', initSrc);
    }
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
    
    initFormValidation();
    initFeatureCards();
    initSectionToggle();
    initIconSelector();
    initIconEdit();
    initNoticeToggle(); // 공지사항 토글 기능 초기화
    
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
    
    // 헤더 버튼 클릭 이벤트
    const headerButton = document.getElementById('header-button');
    if (headerButton) {
        headerButton.addEventListener('click', () => {
            alert('솔루션 세팅 페이지로 이동합니다.');
        });
    }
    
    // 초기 페이지 설정
    ScreenManager.setPage(0);
    
    // 페이지 0에서 시작 후 자동으로 페이지 2로 전환 (데모용)
    setTimeout(() => {
        ScreenManager.setPage(2);
        // 메인 화면 말풍선 표시
        showMainBalloons();
    }, 3000);
});
