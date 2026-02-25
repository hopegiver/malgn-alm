export default {
    layout: 'default',

    data() {
        return {
            stats: {
                activeProjects: 8,
                totalProjects: 12,
                openIssues: 47,
                issuesChange: -12.3,
                sprintProgress: 64,
                sprintName: 'Sprint 2025-04',
                weeklyDeploys: 5,
                deploySuccessRate: 100
            },
            sprint: {
                todo: 12,
                inProgress: 8,
                inReview: 4,
                done: 18,
                activeIssues: [
                    { id: 1, key: 'ALM-142', title: '사용자 권한 관리 API 개발', priority: '높음', assigneeInitial: '김' },
                    { id: 2, key: 'ALM-138', title: '스프린트 번다운 차트 구현', priority: '중간', assigneeInitial: '이' },
                    { id: 3, key: 'ALM-155', title: '배포 파이프라인 알림 연동', priority: '높음', assigneeInitial: '박' },
                    { id: 4, key: 'ALM-160', title: '테스트 커버리지 리포트 자동화', priority: '낮음', assigneeInitial: '정' }
                ]
            },
            recentActivities: [
                { id: 1, icon: 'bi bi-git', color: 'var(--primary-color)', message: '박민수님이 feature/auth 브랜치에 커밋 push', time: '5분 전' },
                { id: 2, icon: 'bi bi-check-circle-fill', color: '#22c55e', message: 'ALM-138 이슈가 "완료"로 변경됨', time: '15분 전' },
                { id: 3, icon: 'bi bi-rocket-takeoff', color: '#6366f1', message: 'v2.4.1 스테이징 환경 배포 성공', time: '32분 전' },
                { id: 4, icon: 'bi bi-bug', color: '#ef4444', message: '김영희님이 새 버그 등록: 로그인 세션 만료 이슈', time: '1시간 전' },
                { id: 5, icon: 'bi bi-chat-dots', color: '#f59e0b', message: 'ALM-142 코드 리뷰 코멘트 3개 추가', time: '1시간 전' },
                { id: 6, icon: 'bi bi-person-plus', color: '#8b5cf6', message: '이수진님이 프로젝트 "모바일 앱"에 참여', time: '2시간 전' },
                { id: 7, icon: 'bi bi-shield-check', color: '#22c55e', message: 'QA 승인 완료: 결제 모듈 v2.3', time: '3시간 전' }
            ],
            projects: [
                { id: 1, name: 'ALM 플랫폼', initial: 'AP', color: '#6366f1', team: '플랫폼팀', progress: 72, openIssues: 15, bugs: 3, nextRelease: '2025-03-15', status: '정상' },
                { id: 2, name: '모바일 앱 v3', initial: 'MA', color: '#f59e0b', team: '모바일팀', progress: 45, openIssues: 22, bugs: 8, nextRelease: '2025-04-01', status: '주의' },
                { id: 3, name: '결제 시스템', initial: 'PS', color: '#22c55e', team: '커머스팀', progress: 89, openIssues: 5, bugs: 1, nextRelease: '2025-03-08', status: '정상' },
                { id: 4, name: '데이터 파이프라인', initial: 'DP', color: '#ef4444', team: '데이터팀', progress: 31, openIssues: 18, bugs: 12, nextRelease: '2025-05-20', status: '위험' },
                { id: 5, name: '관리자 포탈', initial: 'AD', color: '#8b5cf6', team: '백오피스팀', progress: 95, openIssues: 2, bugs: 0, nextRelease: '2025-03-05', status: '정상' }
            ]
        };
    },

    async mounted() {
        await this.loadDashboardData();
    },

    methods: {
        async loadDashboardData() {
            // TODO: API 호출로 실제 데이터 로드
            // const response = await this.$api.get('/api/dashboard');
            // this.stats = response.data.stats;
        },

        getChangeClass(change, inverse) {
            if (inverse) {
                return change <= 0 ? 'text-success' : 'text-danger';
            }
            return change >= 0 ? 'text-success' : 'text-danger';
        },

        getChangeIcon(change, inverse) {
            if (inverse) {
                return change <= 0 ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
            }
            return change >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
        },

        getPriorityClass(priority) {
            const map = {
                '높음': 'bg-danger-subtle text-danger',
                '중간': 'bg-warning-subtle text-warning',
                '낮음': 'bg-info-subtle text-info'
            };
            return map[priority] || 'bg-secondary-subtle text-secondary';
        },

        getProgressClass(progress) {
            if (progress >= 80) return 'bg-success';
            if (progress >= 50) return 'bg-primary';
            if (progress >= 30) return 'bg-warning';
            return 'bg-danger';
        },

        getProjectStatusClass(status) {
            const map = {
                '정상': 'bg-success-subtle text-success',
                '주의': 'bg-warning-subtle text-warning',
                '위험': 'bg-danger-subtle text-danger',
                '완료': 'bg-primary-subtle text-primary'
            };
            return map[status] || 'bg-secondary-subtle text-secondary';
        },

        goToIssues() {
            this.navigateTo('/development/issues');
        },

        goToSprint() {
            this.navigateTo('/planning/sprints');
        },

        goToProject(id) {
            this.navigateTo('/portfolio/projects', { id });
        }
    }
};
