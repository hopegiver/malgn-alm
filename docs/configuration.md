# 전체 설정 옵션 (Configuration)

## ViewLogicRouter 초기화 옵션

```javascript
const router = new ViewLogicRouter({
    // 기본 설정
    basePath: '/',                    // 앱 기본 경로
    srcPath: '/src',                  // 소스 파일 경로
    mode: 'hash',                     // 'hash' 또는 'history'
    environment: 'development',       // 'development' 또는 'production'

    // 캐싱
    cacheMode: 'memory',              // 'memory', 'sessionStorage', 'localStorage', 'none'
    cacheTTL: 300000,                 // 캐시 유지 시간 (밀리초, 기본 5분)
    maxCacheSize: 50,                 // 최대 캐시 항목 수

    // 레이아웃
    useLayout: true,                  // 레이아웃 사용 여부
    defaultLayout: 'default',         // 기본 레이아웃

    // 인증
    authEnabled: false,               // 인증 활성화
    loginRoute: 'login',              // 로그인 라우트
    protectedRoutes: [],              // 보호할 라우트 목록 (와일드카드 지원: 'admin/*')
    authStorage: 'localStorage',      // 토큰 저장소

    // 다국어
    useI18n: false,                   // 다국어 활성화
    defaultLanguage: 'ko',            // 기본 언어

    // 로깅
    logLevel: 'info'                  // 'debug', 'info', 'warn', 'error'
});
```

## 프로덕션 권장 설정

```javascript
const router = new ViewLogicRouter({
    environment: 'production',
    logLevel: 'error',
    cacheMode: 'memory',
    cacheTTL: 600000     // 10분
});
```
