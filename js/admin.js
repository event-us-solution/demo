// 관리자 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 데이터 로드
    loadData();
    
    // 현재 말풍선 데이터 표시
    loadBalloonFormData();
    
    // 실시간 미리보기 업데이트
    setupPreviewUpdates();
});

// 폼에 현재 말풍선 데이터 로드
function loadBalloonFormData() {
    const eventBalloon = DemoData.balloons['event-participation'];
    const attendanceBalloon = DemoData.balloons['attendance-check'];
    
    // 이벤트 참여하기
    if (eventBalloon) {
        const eventIcon = document.getElementById('event-icon');
        const eventText = document.getElementById('event-text');
        const eventType = document.getElementById('event-type');
        if (eventIcon) eventIcon.value = eventBalloon.icon || '🎉';
        if (eventText) eventText.value = eventBalloon.text || '이벤트 참여하기';
        if (eventType) eventType.value = eventBalloon.type || 'purple';
    }
    
    // 출석체크
    if (attendanceBalloon) {
        const attendanceIcon = document.getElementById('attendance-icon');
        const attendanceText = document.getElementById('attendance-text');
        const attendanceType = document.getElementById('attendance-type');
        if (attendanceIcon) attendanceIcon.value = attendanceBalloon.icon || '✓';
        if (attendanceText) attendanceText.value = attendanceBalloon.text || '출석체크';
        if (attendanceType) attendanceType.value = attendanceBalloon.type || 'white';
    }
    
    // 미리보기 업데이트
    updatePreview('event-participation');
    updatePreview('attendance-check');
}

// 실시간 미리보기 업데이트 설정
function setupPreviewUpdates() {
    // 이벤트 참여하기
    const eventIcon = document.getElementById('event-icon');
    const eventText = document.getElementById('event-text');
    const eventType = document.getElementById('event-type');
    
    if (eventIcon) {
        eventIcon.addEventListener('input', () => {
            updatePreview('event-participation');
        });
    }
    if (eventText) {
        eventText.addEventListener('input', () => {
            updatePreview('event-participation');
        });
    }
    if (eventType) {
        eventType.addEventListener('change', () => {
            updatePreview('event-participation');
        });
    }
    
    // 출석체크
    const attendanceIcon = document.getElementById('attendance-icon');
    const attendanceText = document.getElementById('attendance-text');
    const attendanceType = document.getElementById('attendance-type');
    
    if (attendanceIcon) {
        attendanceIcon.addEventListener('input', () => {
            updatePreview('attendance-check');
        });
    }
    if (attendanceText) {
        attendanceText.addEventListener('input', () => {
            updatePreview('attendance-check');
        });
    }
    if (attendanceType) {
        attendanceType.addEventListener('change', () => {
            updatePreview('attendance-check');
        });
    }
}

// 미리보기 업데이트
function updatePreview(balloonId) {
    let iconInput, textInput, typeSelect, previewBalloon, previewIcon, previewText;
    
    if (balloonId === 'event-participation') {
        iconInput = document.getElementById('event-icon');
        textInput = document.getElementById('event-text');
        typeSelect = document.getElementById('event-type');
        previewBalloon = document.getElementById('preview-event-participation');
        previewIcon = document.getElementById('preview-icon-event-participation');
        previewText = document.getElementById('preview-text-event-participation');
    } else if (balloonId === 'attendance-check') {
        iconInput = document.getElementById('attendance-icon');
        textInput = document.getElementById('attendance-text');
        typeSelect = document.getElementById('attendance-type');
        previewBalloon = document.getElementById('preview-attendance-check');
        previewIcon = document.getElementById('preview-icon-attendance-check');
        previewText = document.getElementById('preview-text-attendance-check');
    }
    
    if (!iconInput || !textInput || !typeSelect || !previewBalloon || !previewIcon || !previewText) {
        return;
    }
    
    // 아이콘 업데이트
    previewIcon.textContent = iconInput.value || (balloonId === 'event-participation' ? '🎉' : '✓');
    
    // 텍스트 업데이트
    previewText.textContent = textInput.value || (balloonId === 'event-participation' ? '이벤트 참여하기' : '출석체크');
    
    // 색상 업데이트
    previewBalloon.className = `preview-balloon ${typeSelect.value}`;
}

// 말풍선 저장
function saveBalloons() {
    // 이벤트 참여하기
    const eventIcon = document.getElementById('event-icon');
    const eventText = document.getElementById('event-text');
    const eventType = document.getElementById('event-type');
    
    if (!eventText || !eventText.value.trim()) {
        alert('이벤트 참여하기 말풍선의 텍스트를 입력해주세요.');
        return;
    }
    
    DemoData.balloons['event-participation'] = {
        id: 'event-participation',
        icon: eventIcon ? eventIcon.value.trim() || '🎉' : '🎉',
        text: eventText.value.trim(),
        type: eventType ? eventType.value : 'purple',
        page: 2,
        order: 1
    };
    
    // 출석체크
    const attendanceIcon = document.getElementById('attendance-icon');
    const attendanceText = document.getElementById('attendance-text');
    const attendanceType = document.getElementById('attendance-type');
    
    if (!attendanceText || !attendanceText.value.trim()) {
        alert('출석체크 말풍선의 텍스트를 입력해주세요.');
        return;
    }
    
    DemoData.balloons['attendance-check'] = {
        id: 'attendance-check',
        icon: attendanceIcon ? attendanceIcon.value.trim() || '✓' : '✓',
        text: attendanceText.value.trim(),
        type: attendanceType ? attendanceType.value : 'white',
        page: 2,
        order: 2
    };
    
    // 데이터 저장
    saveData();
    
    // 저장 메시지 표시
    showSaveMessage();
}

// 초기화
function resetBalloons() {
    if (!confirm('말풍선을 기본값으로 초기화하시겠습니까?')) {
        return;
    }
    
    // 기본값으로 복원
    DemoData.balloons['event-participation'] = {
        id: 'event-participation',
        icon: '🎉',
        text: '이벤트 참여하기',
        type: 'purple',
        page: 2,
        order: 1
    };
    
    DemoData.balloons['attendance-check'] = {
        id: 'attendance-check',
        icon: '✓',
        text: '출석체크',
        type: 'white',
        page: 2,
        order: 2
    };
    
    // 데이터 저장
    saveData();
    
    // 폼 업데이트
    loadBalloonFormData();
    
    // 저장 메시지 표시
    showSaveMessage();
}

// 저장 메시지 표시
function showSaveMessage() {
    const message = document.getElementById('save-message');
    if (message) {
        message.classList.add('show');
        
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }
}
