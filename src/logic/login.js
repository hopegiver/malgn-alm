export default {
    layout: null, // 로그인 페이지는 레이아웃 없음

    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            showPassword: false,
            loading: false,
            errorMessage: '',
            isDevelopmentMode: window.DEV_MODE || false
        };
    },

    mounted() {
        // 이미 로그인된 경우 대시보드로 리다이렉트
        if (this.isLoggedIn()) {
            this.navigateTo('/dashboard');
        }
    },

    methods: {
        isLoggedIn() {
            return !!localStorage.getItem('auth_token');
        },

        async handleLogin() {
            // 입력 검증
            if (!this.email || !this.password) {
                this.errorMessage = '이메일과 비밀번호를 입력해주세요.';
                return;
            }

            this.loading = true;
            this.errorMessage = '';

            try {
                // TODO: 실제 API 호출
                // const response = await this.$api.post('/api/auth/login', {
                //     email: this.email,
                //     password: this.password,
                //     rememberMe: this.rememberMe
                // });

                // 임시: 개발용 로그인 (모든 이메일/비밀번호 허용)
                await this.simulateLogin(this.email);

            } catch (error) {
                this.errorMessage = error.message || '로그인에 실패했습니다. 다시 시도해주세요.';
            } finally {
                this.loading = false;
            }
        },

        async simulateLogin(email) {
            // 실제 API 호출을 시뮬레이션 (1초 대기)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 이메일에 따라 역할 결정
            let role = window.USER_ROLES.VIEWER;
            let name = '사용자';

            if (email.includes('admin')) {
                role = window.USER_ROLES.ADMIN;
                name = '관리자';
            } else if (email.includes('editor')) {
                role = window.USER_ROLES.EDITOR;
                name = '편집자';
            } else if (email.includes('analyst')) {
                role = window.USER_ROLES.ANALYST;
                name = '분석가';
            }

            const user = {
                id: 1,
                name: name,
                email: email,
                role: role,
                avatar: null,
                loginAt: new Date().toISOString()
            };

            // 토큰 및 사용자 정보 저장
            const token = 'dev_token_' + Date.now();
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 대시보드로 이동
            this.navigateTo('/dashboard');
        },

        quickLogin(type) {
            const credentials = {
                'admin': { email: 'admin@videopack.com', password: 'admin123' },
                'editor': { email: 'editor@videopack.com', password: 'editor123' },
                'viewer': { email: 'viewer@videopack.com', password: 'viewer123' }
            };

            const cred = credentials[type];
            if (cred) {
                this.email = cred.email;
                this.password = cred.password;
                this.handleLogin();
            }
        }
    }
};
