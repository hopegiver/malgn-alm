# Portfolio API Specification

Portfolio 모듈 API 명세서

---

## 공통 사항

### Base URL
```
/api
```

### 응답 형식
모든 응답은 JSON 형식이며, 목록 조회 시 배열(`[]`)을 반환합니다.

### Mock 데이터 경로
API 호출 실패 시 `/mock-api/{module}/{resource}.json` 파일을 fallback으로 사용합니다.

### 공통 필드 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `id` | 정수 (생성 시 `Date.now()`) | `1`, `1740000000000` |
| `date` | ISO 날짜 문자열 | `"2025-03-15"` |
| `currency` | 정수 (원 단위) | `500000000` |

---

## 1. Portfolio - Projects (제품/프로젝트 목록)

### `GET /api/portfolio/projects`

프로젝트 목록을 조회합니다.

**Mock 파일:** `/mock-api/portfolio/projects.json`

**Response:** `Project[]`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | number | O | 프로젝트 고유 ID |
| `name` | string | O | 프로젝트명 |
| `code` | string | O | 프로젝트 코드 (예: `PRJ-001`) |
| `description` | string | - | 프로젝트 설명 |
| `status` | string | O | 상태 |
| `priority` | string | O | 우선순위 |
| `owner` | string | O | 담당자 |
| `startDate` | date | O | 시작일 |
| `endDate` | date | O | 종료일 |
| `budget` | currency | - | 예산 (원) |
| `progress` | number | - | 진행률 (0~100) |
| `color` | string | - | 프로젝트 색상 HEX (기본: `#6366f1`) |
| `members` | number | - | 참여 인원 수 (기본: `1`) |

**status enum:**

| 값 | 라벨 |
|----|------|
| `planning` | 기획중 |
| `active` | 진행중 |
| `on-hold` | 보류 |
| `completed` | 완료 |
| `cancelled` | 취소 |

**priority enum:**

| 값 | 라벨 |
|----|------|
| `critical` | 긴급 |
| `high` | 높음 |
| `medium` | 보통 |
| `low` | 낮음 |

**클라이언트 필터링:**

| 파라미터 | 대상 필드 |
|----------|-----------|
| `keyword` | `name`, `code`, `owner` (부분 일치, 대소문자 무시) |
| `statusFilter` | `status` (일치) |

---

### `POST /api/portfolio/projects`

프로젝트를 생성합니다.

**Request Body:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | O | 프로젝트명 |
| `code` | string | O | 프로젝트 코드 |
| `description` | string | - | 프로젝트 설명 |
| `status` | string | O | 상태 (기본: `planning`) |
| `priority` | string | O | 우선순위 (기본: `medium`) |
| `owner` | string | O | 담당자 |
| `startDate` | date | O | 시작일 |
| `endDate` | date | O | 종료일 (`startDate` 이후) |
| `budget` | currency | - | 예산 (기본: `0`) |
| `color` | string | - | 프로젝트 색상 HEX (기본: `#6366f1`) |
| `members` | number | - | 참여 인원 수 (기본: `1`) |

**유효성 검사:**
- `name`: 필수 (빈 문자열 불가)
- `code`: 필수 (빈 문자열 불가)
- `owner`: 필수 (빈 문자열 불가)
- `startDate`: 필수
- `endDate`: 필수, `startDate` 이후

**Response:** 생성 시 `progress: 0` 자동 설정

---

### `PUT /api/portfolio/projects/:id`

프로젝트를 수정합니다.

**Path Parameter:** `id` - 프로젝트 ID

**Request Body:** POST와 동일 (전체 필드 전송)

---

### `DELETE /api/portfolio/projects/:id`

프로젝트를 삭제합니다.

**Path Parameter:** `id` - 프로젝트 ID

---

## 2. Portfolio - OKR (전략 목표)

### `GET /api/portfolio/okr`

OKR 목록을 조회합니다.

**Mock 파일:** `/mock-api/portfolio/okr.json`

**Response:** `Objective[]`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | number | O | 목표 고유 ID |
| `objective` | string | O | 목표명 |
| `quarter` | string | O | 분기 (예: `2025-Q1`) |
| `year` | number | O | 연도 |
| `owner` | string | O | 담당자 |
| `status` | string | O | 상태 |
| `keyResults` | KeyResult[] | O | 핵심 결과 목록 |

**KeyResult 스키마:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | number | O | KR 고유 ID |
| `title` | string | O | KR 제목 |
| `metric` | string | O | 측정 지표명 |
| `startValue` | number | O | 시작 값 |
| `targetValue` | number | O | 목표 값 |
| `currentValue` | number | O | 현재 값 |
| `unit` | string | O | 단위 (예: `%`, `점`, `시간`, `건/KLOC`, `회/주`, `일`) |

**status enum:**

| 값 | 라벨 |
|----|------|
| `draft` | 초안 |
| `active` | 진행중 |
| `at-risk` | 위험 |
| `achieved` | 달성 |
| `missed` | 미달성 |

**quarter 형식:** `{YYYY}-Q{1-4}` (예: `2025-Q1`)

**클라이언트 필터링:**

| 파라미터 | 대상 필드 |
|----------|-----------|
| `keyword` | `objective`, `owner` (부분 일치, 대소문자 무시) |
| `quarterFilter` | `quarter` (일치) |

**진행률 계산 공식:**
```
KR 진행률 = |currentValue - startValue| / |targetValue - startValue| × 100
Objective 진행률 = KR 진행률들의 평균
```

---

### `POST /api/portfolio/okr`

OKR을 생성합니다.

**Request Body:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `objective` | string | O | 목표명 |
| `quarter` | string | O | 분기 |
| `year` | number | O | 연도 |
| `owner` | string | O | 담당자 |
| `status` | string | O | 상태 (기본: `draft`) |

**유효성 검사:**
- `objective`: 필수 (빈 문자열 불가)
- `quarter`: 필수
- `owner`: 필수 (빈 문자열 불가)

**Response:** 생성 시 `keyResults: []` 자동 설정

---

### `PUT /api/portfolio/okr/:id`

OKR을 수정합니다.

**Path Parameter:** `id` - OKR ID

**Request Body:** Objective 전체 필드 (keyResults 포함)

---

### `DELETE /api/portfolio/okr/:id`

OKR을 삭제합니다.

**Path Parameter:** `id` - OKR ID

---

### Key Results (하위 리소스)

> 현재 Key Results의 CRUD는 클라이언트 측에서 Objective의 `keyResults` 배열을 직접 조작합니다.
> 향후 독립 API로 분리할 수 있습니다.

**KR 추가/수정 유효성 검사:**
- `title`: 필수 (빈 문자열 불가)
- `metric`: 필수 (빈 문자열 불가)

---

## 3. Portfolio - Roadmap (로드맵)

### `GET /api/portfolio/roadmap`

로드맵 항목 목록을 조회합니다.

**Mock 파일:** `/mock-api/portfolio/roadmap.json`

**Response:** `RoadmapItem[]`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | number | O | 항목 고유 ID |
| `title` | string | O | 제목 |
| `description` | string | - | 설명 |
| `category` | string | O | 카테고리 |
| `status` | string | O | 상태 |
| `priority` | string | O | 우선순위 |
| `project` | string | O | 소속 프로젝트명 |
| `owner` | string | O | 담당자 |
| `quarter` | string | O | 목표 분기 (예: `2025-Q2`) |
| `startDate` | date | - | 시작일 |
| `endDate` | date | - | 종료일 |

**category enum:**

| 값 | 라벨 |
|----|------|
| `feature` | 기능 |
| `improvement` | 개선 |
| `tech-debt` | 기술 부채 |
| `infrastructure` | 인프라 |
| `research` | R&D |

**status enum:**

| 값 | 라벨 |
|----|------|
| `planned` | 계획 |
| `in-progress` | 진행중 |
| `review` | 검토 |
| `done` | 완료 |
| `deferred` | 연기 |

**priority enum:**

| 값 | 라벨 |
|----|------|
| `critical` | 긴급 |
| `high` | 높음 |
| `medium` | 보통 |
| `low` | 낮음 |

**클라이언트 필터링:**

| 파라미터 | 대상 필드 |
|----------|-----------|
| `keyword` | `title`, `project`, `owner` (부분 일치, 대소문자 무시) |
| `categoryFilter` | `category` (일치) |

**클라이언트 그룹핑:** `quarter` 필드 기준으로 그룹핑하여 타임라인 뷰 표시

---

### `POST /api/portfolio/roadmap`

로드맵 항목을 생성합니다.

**Request Body:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | O | 제목 |
| `description` | string | - | 설명 |
| `category` | string | O | 카테고리 (기본: `feature`) |
| `status` | string | O | 상태 (기본: `planned`) |
| `priority` | string | O | 우선순위 (기본: `medium`) |
| `project` | string | O | 소속 프로젝트명 |
| `owner` | string | O | 담당자 |
| `quarter` | string | O | 목표 분기 |
| `startDate` | date | - | 시작일 |
| `endDate` | date | - | 종료일 |

**유효성 검사:**
- `title`: 필수 (빈 문자열 불가)
- `project`: 필수 (빈 문자열 불가)
- `owner`: 필수 (빈 문자열 불가)
- `quarter`: 필수

---

### `PUT /api/portfolio/roadmap/:id`

로드맵 항목을 수정합니다.

**Path Parameter:** `id` - 항목 ID

**Request Body:** POST와 동일 (전체 필드 전송)

---

### `DELETE /api/portfolio/roadmap/:id`

로드맵 항목을 삭제합니다.

**Path Parameter:** `id` - 항목 ID

---

## 4. Portfolio - ROI (투자 대비 성과)

### `GET /api/portfolio/roi`

ROI 데이터 목록을 조회합니다.

**Mock 파일:** `/mock-api/portfolio/roi.json`

**Response:** `RoiItem[]`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | number | O | 항목 고유 ID |
| `project` | string | O | 프로젝트명 |
| `period` | string | O | 측정 기간 (예: `2025`, `2024`) |
| `investmentCost` | currency | O | 투자 비용 (원) |
| `operatingCost` | currency | O | 운영 비용 (원) |
| `expectedRevenue` | currency | O | 기대 수익 (원) |
| `actualRevenue` | currency | O | 실제 수익 (원) |
| `costSaving` | currency | O | 비용 절감액 (원) |
| `status` | string | O | 상태 |
| `owner` | string | O | 담당자 |
| `notes` | string | - | 비고 |

**status enum:**

| 값 | 라벨 |
|----|------|
| `planning` | 계획 |
| `tracking` | 추적중 |
| `positive` | 양호 |
| `negative` | 부진 |
| `closed` | 종료 |

**period 형식:** `{YYYY}` 또는 `{YYYY}-H{1-2}` (예: `2025`, `2025-H1`)

**클라이언트 필터링:**

| 파라미터 | 대상 필드 |
|----------|-----------|
| `keyword` | `project`, `owner` (부분 일치, 대소문자 무시) |
| `periodFilter` | `period` (일치) |

**클라이언트 계산 공식:**
```
총비용        = investmentCost + operatingCost
총효과        = actualRevenue + costSaving
ROI(%)       = (총효과 - 총비용) / 총비용 × 100
목표 달성률(%) = 총효과 / expectedRevenue × 100
```

**요약 통계 (summaryStats):**
```
총 투자액 = Σ (investmentCost + operatingCost)
총 수익   = Σ (actualRevenue + costSaving)
기대 수익 = Σ expectedRevenue
평균 ROI  = (총 수익 - 총 투자액) / 총 투자액 × 100
```

---

### `POST /api/portfolio/roi`

ROI 항목을 생성합니다.

**Request Body:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `project` | string | O | 프로젝트명 |
| `period` | string | O | 측정 기간 |
| `investmentCost` | currency | - | 투자 비용 (기본: `0`) |
| `operatingCost` | currency | - | 운영 비용 (기본: `0`) |
| `expectedRevenue` | currency | - | 기대 수익 (기본: `0`) |
| `actualRevenue` | currency | - | 실제 수익 (기본: `0`) |
| `costSaving` | currency | - | 비용 절감액 (기본: `0`) |
| `status` | string | O | 상태 (기본: `tracking`) |
| `owner` | string | O | 담당자 |
| `notes` | string | - | 비고 |

**유효성 검사:**
- `project`: 필수 (빈 문자열 불가)
- `period`: 필수
- `owner`: 필수 (빈 문자열 불가)

---

### `PUT /api/portfolio/roi/:id`

ROI 항목을 수정합니다.

**Path Parameter:** `id` - 항목 ID

**Request Body:** POST와 동일 (전체 필드 전송)

---

### `DELETE /api/portfolio/roi/:id`

ROI 항목을 삭제합니다.

**Path Parameter:** `id` - 항목 ID

---

## 통화 표시 형식

클라이언트에서 사용하는 통화 포맷 함수:

| 함수 | 입력 | 출력 | 사용처 |
|------|------|------|--------|
| `formatCurrency` | `500000000` | `5.0억` | Projects (목록 테이블) |
| `formatCurrency` | `300000000` | `3.0억` | ROI (간략 표시) |
| `formatCurrency` | `50000` | `5만` | ROI (간략 표시) |
| `formatFullCurrency` | `500000000` | `500,000,000원` | ROI (상세 표시) |
