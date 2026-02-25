# ViewLogic 개발 규칙

적용 대상: .js, .ts

## 파일 구조
- `src/views/{name}.html` ↔ `src/logic/{name}.js` 반드시 동일 이름
- 폴더명 = 라우트: `goals/my-goals` → `#/goals/my-goals`
- HTML은 views/, JavaScript는 logic/ 에만 작성

## 필수 패턴
- 페이지 이동: `this.navigateTo('/path')`, `this.navigateTo('/path', { id: 123 })`
- 파라미터: `this.getParam('id')`, `this.getParams()`
- API: `this.$api.get()`, `this.$api.post()`, `this.$api.put()`, `this.$api.delete()`
- 모달: `this.$nextTick()` 내에서 `new bootstrap.Modal()` 초기화
- 폼: `@submit.prevent="handler"` 사용
- 레이아웃 끄기: `layout: null`

## 내장 메서드
- 라우팅: `navigateTo()`, `getCurrentRoute()`, `getParam()`, `getParams()`
- 인증: `isAuth()`, `getToken()`, `setToken()`, `logout()`
- 데이터: `fetchData()`, `this.$api`, `this.$state`
- 다국어: `this.$t()`, `this.$lang`, `this.$i18n.setLanguage()`
- 디버그: `this.log()`

## 금지 사항
- HTML에 `<style>` 태그
- `layout: false` (null 사용)
- `:key="index"` (고유 ID 사용)
- `Promise.then/catch` (async/await 사용)
- `window.location.hash/href` 직접 조작 (navigateTo 사용)
- 경로 파라미터 `navigateTo('/path/123')` (쿼리 파라미터 사용)

## computed vs methods
- computed: 캐싱되는 계산값 (자주 안 변하는 것)
- methods: 매번 새로 계산하는 값

## 참조 트리거
- **페이지 생성 시**: `.claude/templates/page.md` 필수 참조 후 적절한 변형 선택
- **컴포넌트 생성 시**: `.claude/templates/component.md` 필수 참조
- **레이아웃 생성 시**: `.claude/templates/layout.md` 필수 참조
- **내장 컴포넌트 사용 시**: `docs/components-builtin.md` 참조하여 Props/Events 확인
- **dataURL 사용 시**: `docs/data-fetching.md` 참조
- **에러 처리/로딩/밸리데이션 구현 시**: `docs/patterns.md` 참조하여 표준 패턴 적용

## 상세 문서
`docs/` 폴더에 기능별 상세 문서: routing, data-fetching, forms, api, auth, i18n, components, components-builtin, layout, patterns, advanced, configuration
