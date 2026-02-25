# 인증 처리 (Authentication)

## 라우터 설정

```javascript
const router = new ViewLogicRouter({
    authEnabled: true,
    loginRoute: 'login',
    protectedRoutes: ['profile', 'admin/*'],
    authStorage: 'localStorage'  // 'cookie', 'sessionStorage', 'memory'
});
```

## 로그인 구현

```javascript
export default {
    name: 'Login',
    data() {
        return { username: '', password: '', error: '' }
    },
    methods: {
        async handleLogin() {
            try {
                const response = await this.$api.post('/api/login', {
                    username: this.username,
                    password: this.password
                });
                this.setToken(response.token);
                const redirect = this.getParam('redirect', 'home');
                this.navigateTo(`/${redirect}`);
            } catch (error) {
                this.error = '로그인 실패';
            }
        }
    }
}
```

## 로그아웃

```javascript
this.logout();  // 자동으로 login 페이지로 이동
```

## 인증 상태 확인

```javascript
mounted() {
    this.isLoggedIn = this.isAuth();      // 로그인 여부
    this.token = this.getToken();         // 토큰 가져오기
    if (this.isLoggedIn) {
        this.loadUserProfile();
    }
}
```

## 자동 토큰 주입

인증 활성화 시 모든 API 요청에 자동으로 Authorization 헤더 추가:
```
Authorization: Bearer YOUR_TOKEN
```
