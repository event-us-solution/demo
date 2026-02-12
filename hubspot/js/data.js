// 로컬 데이터 관리
const DemoData = {
    // 미리 등록된 전화번호
    preRegisteredPhone: '01041283217',
    
    // 참가자 정보 저장소
    participants: [],
    
    // 공지사항 데이터
    notices: [
        {
            id: 1,
            title: '행사 안내',
            content: '오늘 행사에 참석해주셔서 감사합니다. 행사는 오후 2시에 시작됩니다.',
            date: '2024-01-15',
            author: '운영팀'
        },
        {
            id: 2,
            title: '경품 추첨 안내',
            content: '오후 4시에 경품 추첨이 진행됩니다. 설문조사에 참여해주세요!',
            date: '2024-01-15',
            author: '운영팀'
        }
    ],
    
    // 연사 정보
    speakers: [
        {
            id: 1,
            name: '김연사',
            title: '시니어 개발자',
            company: '테크컴퍼니',
            bio: '10년 이상의 개발 경험을 가진 시니어 개발자입니다.',
            image: '👨‍💻'
        },
        {
            id: 2,
            name: '이연사',
            title: '프로덕트 매니저',
            company: '스타트업',
            bio: '사용자 중심의 제품 개발을 추구하는 PM입니다.',
            image: '👩‍💼'
        }
    ],
    
    // Q&A 데이터
    qnas: [
        {
            id: 1,
            question: '행사는 언제까지 진행되나요?',
            answer: '오후 6시까지 진행됩니다.',
            date: '2024-01-15 14:30'
        }
    ],
    
    // 투표 데이터
    votes: {
        speakers: [
            { id: 1, name: '김연사', votes: 0 },
            { id: 2, name: '이연사', votes: 0 }
        ],
        userVoted: false
    },
    
    // 경품 추첨 데이터
    lottery: {
        participants: [],
        drawn: false,
        winner: null
    },
    
    // 경연대회 데이터
    competition: {
        presenters: [
            { id: 1, name: '팀 A', investment: 0 },
            { id: 2, name: '팀 B', investment: 0 }
        ],
        userInvestment: 0,
        totalBudget: 1000000
    },
    
    // 출석 데이터
    attendance: {
        checked: false,
        checkInTime: null,
        checkOutTime: null
    },
    
    // 말풍선 데이터 (관리자가 수정 가능)
    balloons: {
        'event-participation': {
            id: 'event-participation',
            type: 'purple',
            icon: '🎉',
            text: '이벤트 참여하기',
            page: 2,
            order: 1
        },
        'attendance-check': {
            id: 'attendance-check',
            type: 'white',
            icon: '✓',
            text: '출석체크',
            page: 2,
            order: 2
        }
    },
    
    // 현재 사용자 정보
    currentUser: null
};

// 로컬스토리지에 데이터 저장
function saveData() {
    try {
        localStorage.setItem('demoData', JSON.stringify(DemoData));
    } catch (e) {
        console.error('데이터 저장 실패:', e);
    }
}

// 로컬스토리지에서 데이터 불러오기
function loadData() {
    try {
        const saved = localStorage.getItem('demoData');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(DemoData, parsed);
        }
    } catch (e) {
        console.error('데이터 불러오기 실패:', e);
    }
}

// 초기화 시 데이터 불러오기
loadData();



