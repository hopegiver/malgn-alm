# Malgnsoft ALM

## 프로젝트 개요

Application Lifecycle Management(ALM) 시스템. 소프트웨어 개발의 전체 생명주기를 관리하며, 포트폴리오 관리부터 거버넌스까지 통합 지원.

Vue 3 + ViewLogic Router 기반의 SPA. Bootstrap 5로 스타일링하며, 빌드 과정 없이 CDN으로 직접 실행 가능.

## 기술 스택

- **프레임워크**: Vue 3 (CDN)
- **라우터**: ViewLogic Router 1.4.0 (파일 기반 라우팅)
- **CSS**: Bootstrap 5.3.3 + 최소한의 커스텀 CSS (`css/base.css`)
- **빌드**: 없음 (정적 파일 서빙)

## 프로젝트 구조

```
project/
├── index.html              # 진입점 (Vue, ViewLogic, Bootstrap CDN 로드)
├── css/base.css            # 커스텀 CSS (Bootstrap 우선, 최소화)
├── src/
│   ├── views/              # HTML 템플릿 (CSS 금지)
│   │   ├── layout/         # 레이아웃 템플릿
│   │   └── {module}/{page}.html
│   ├── logic/              # JavaScript 로직
│   │   ├── layout/         # 레이아웃 스크립트
│   │   └── {module}/{page}.js
│   └── components/         # 재사용 컴포넌트
├── i18n/                   # 다국어 파일 (선택)
└── docs/                   # 상세 문서
```

## ALM 모듈 구조

| # | 모듈 | 라우트 프리픽스 | 설명 |
|---|------|----------------|------|
| ① | **Portfolio** | `/portfolio/` | 제품/프로젝트 목록, 전략 목표(OKR), 로드맵, 투자 대비 성과 |
| ② | **Requirements** | `/requirements/` | 요구사항 등록, 기능 명세, 변경 요청(CR), 승인 워크플로우, 추적 매트릭스 |
| ③ | **Planning** | `/planning/` | 스프린트 계획, 백로그, 마일스톤, 리소스 할당 |
| ④ | **Development** | `/development/` | 이슈 관리, 브랜치 전략, 코드 리뷰, 빌드 상태, 커밋 추적 |
| ⑤ | **Testing** | `/testing/` | 테스트 케이스, 자동 테스트 결과, 테스트 커버리지, 버그 관리, QA 승인 |
| ⑥ | **Release** | `/release/` | 릴리즈 버전 관리, 배포 이력, 환경별 배포 상태, 롤백 관리 |
| ⑦ | **Operations** | `/operations/` | 장애 관리, 로그 분석, 모니터링, SLA 관리, 고객 피드백 |
| ⑧ | **Analytics** | `/analytics/` | 생산성 지표, 결함 밀도, 리드 타임, 배포 빈도, MTTR |
| ⑨ | **Governance** | `/governance/` | 권한 관리, 감사 로그, 정책 관리, 보안 이슈 |

### 페이지 라우트 맵

```
#/home                              → 대시보드

#/portfolio/projects                → 제품/프로젝트 목록
#/portfolio/okr                     → 전략 목표 (OKR)
#/portfolio/roadmap                 → 로드맵
#/portfolio/roi                     → 투자 대비 성과

#/requirements/register             → 요구사항 등록
#/requirements/specs                → 기능 명세
#/requirements/change-requests      → 변경 요청 (CR)
#/requirements/approvals            → 승인 워크플로우
#/requirements/traceability         → 추적 매트릭스

#/planning/sprints                  → 스프린트 계획
#/planning/backlog                  → 백로그
#/planning/milestones               → 마일스톤
#/planning/resources                → 리소스 할당

#/development/issues                → 이슈 관리
#/development/branches              → 브랜치 전략
#/development/reviews               → 코드 리뷰
#/development/builds                → 빌드 상태
#/development/commits               → 커밋 추적

#/testing/cases                     → 테스트 케이스
#/testing/automation                → 자동 테스트 결과
#/testing/coverage                  → 테스트 커버리지
#/testing/bugs                      → 버그 관리
#/testing/qa-approval               → QA 승인

#/release/versions                  → 릴리즈 버전 관리
#/release/history                   → 배포 이력
#/release/environments              → 환경별 배포 상태
#/release/rollbacks                 → 롤백 관리

#/operations/incidents              → 장애 관리
#/operations/logs                   → 로그 분석
#/operations/monitoring             → 모니터링
#/operations/sla                    → SLA 관리
#/operations/feedback               → 고객 피드백

#/analytics/productivity            → 생산성 지표
#/analytics/defect-density          → 결함 밀도
#/analytics/lead-time               → 리드 타임
#/analytics/deploy-frequency        → 배포 빈도
#/analytics/mttr                    → MTTR

#/governance/permissions            → 권한 관리
#/governance/audit-logs             → 감사 로그
#/governance/policies               → 정책 관리
#/governance/security               → 보안 이슈
```

## 핵심 규칙

1. **파일 쌍**: `views/{name}.html` ↔ `logic/{name}.js` 반드시 동일 이름
2. **폴더 = 라우트**: `portfolio/projects.html` → `#/portfolio/projects`
3. **CSS**: HTML에 `<style>` 태그 금지, 모든 CSS는 `css/base.css`
4. **라우팅**: `this.navigateTo()` 사용, `window.location` 직접 조작 금지
5. **비동기**: `async/await` 사용, `Promise.then/catch` 금지
6. **레이아웃**: `layout: null` 사용, `layout: false` 금지

## 상세 문서

기능별 상세 문서는 `docs/` 폴더 참조:

| 문서 | 내용 |
|------|------|
| [docs/routing.md](docs/routing.md) | 파일 기반 라우팅, 페이지 이동, 파라미터 |
| [docs/data-fetching.md](docs/data-fetching.md) | dataURL 자동 로딩, 수동 API 호출 |
| [docs/forms.md](docs/forms.md) | 명령형/선언적 폼 처리 |
| [docs/api.md](docs/api.md) | $api 메서드 (GET/POST/PUT/DELETE), 에러 처리 |
| [docs/auth.md](docs/auth.md) | 인증 설정, 로그인/로그아웃, 토큰 관리 |
| [docs/i18n.md](docs/i18n.md) | 다국어 설정, 메시지 파일, 언어 전환 |
| [docs/components.md](docs/components.md) | 컴포넌트 생성/등록 |
| [docs/components-builtin.md](docs/components-builtin.md) | 내장 컴포넌트 상세 (DatePicker, Table, Sidebar 등) |
| [docs/layout.md](docs/layout.md) | 레이아웃 시스템, 레이아웃 지정 |
| [docs/patterns.md](docs/patterns.md) | 공통 패턴 (로딩 상태, 에러 처리, 폼 밸리데이션, 검색/필터) |
| [docs/advanced.md](docs/advanced.md) | 라이프사이클, computed, watch, 캐싱, 상태 관리 |
| [docs/configuration.md](docs/configuration.md) | ViewLogicRouter 전체 설정 옵션 |

## 커맨드

다음 커맨드를 사용하여 빠르게 작업할 수 있습니다:

| 커맨드 | 설명 |
|--------|------|
| `/create-page` | 새 페이지 (view + logic) 생성 |
| `/create-component` | 새 재사용 컴포넌트 생성 |
| `/create-layout` | 새 레이아웃 생성 |

## 템플릿

`.claude/templates/` 폴더에 변형 패턴 포함 템플릿 문서가 있습니다:

| 템플릿 | 용도 |
|--------|------|
| `page.md` | 페이지 (정적, 목록, 상세, 폼 4가지 변형) |
| `component.md` | 컴포넌트 (기본, 슬롯, v-model 3가지 변형) |
| `layout.md` | 레이아웃 (네비게이션, 사이드바 2가지 변형) |

## 개발 서버

```bash
python -m http.server 8000
# 또는 VS Code Live Server (포트 5502)
```

## 추가 리소스

- **ViewLogic GitHub**: https://github.com/hopegiver/viewlogic
- **ViewLogic npm**: https://www.npmjs.com/package/viewlogic
