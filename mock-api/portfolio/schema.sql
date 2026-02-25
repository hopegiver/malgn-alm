-- ============================================================
-- Portfolio Module Schema
-- ============================================================

-- ------------------------------------------------------------
-- 1. 제품/프로젝트 목록
-- ------------------------------------------------------------
CREATE TABLE projects (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(200)  NOT NULL COMMENT '프로젝트명',
    code          VARCHAR(50)   NOT NULL COMMENT '프로젝트 코드 (예: PRJ-001)',
    description   TEXT          NULL     COMMENT '프로젝트 설명',
    status        VARCHAR(20)   NOT NULL DEFAULT 'planning' COMMENT 'planning|active|on-hold|completed|cancelled',
    priority      VARCHAR(20)   NOT NULL DEFAULT 'medium'   COMMENT 'critical|high|medium|low',
    owner         VARCHAR(100)  NOT NULL COMMENT '담당자',
    start_date    DATE          NOT NULL COMMENT '시작일',
    end_date      DATE          NOT NULL COMMENT '종료일',
    budget        BIGINT        NOT NULL DEFAULT 0 COMMENT '예산 (원)',
    progress      TINYINT       NOT NULL DEFAULT 0 COMMENT '진행률 (0~100)',
    color         VARCHAR(7)    NOT NULL DEFAULT '#6366f1' COMMENT '프로젝트 색상 (HEX)',
    members       INT           NOT NULL DEFAULT 1 COMMENT '참여 인원 수',
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_projects_code (code),
    CHECK (progress BETWEEN 0 AND 100),
    CHECK (end_date >= start_date)
) COMMENT = '제품/프로젝트 목록';

-- ------------------------------------------------------------
-- 2. 전략 목표 (OKR) - Objectives
-- ------------------------------------------------------------
CREATE TABLE okr_objectives (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    objective     VARCHAR(300)  NOT NULL COMMENT '목표명',
    quarter       VARCHAR(10)   NOT NULL COMMENT '분기 (예: 2025-Q1)',
    year          SMALLINT      NOT NULL COMMENT '연도',
    owner         VARCHAR(100)  NOT NULL COMMENT '담당자',
    status        VARCHAR(20)   NOT NULL DEFAULT 'draft' COMMENT 'draft|active|at-risk|achieved|missed',
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT = '전략 목표 (OKR) - Objectives';

-- ------------------------------------------------------------
-- 3. 전략 목표 (OKR) - Key Results
-- ------------------------------------------------------------
CREATE TABLE okr_key_results (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    objective_id    BIGINT        NOT NULL COMMENT 'okr_objectives.id',
    title           VARCHAR(300)  NOT NULL COMMENT 'KR 제목',
    metric          VARCHAR(100)  NOT NULL COMMENT '측정 지표명',
    start_value     DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '시작 값',
    target_value    DECIMAL(12,2) NOT NULL COMMENT '목표 값',
    current_value   DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '현재 값',
    unit            VARCHAR(20)   NOT NULL DEFAULT '%' COMMENT '단위 (%, 점, 시간, 건/KLOC, 회/주, 일)',
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (objective_id) REFERENCES okr_objectives(id) ON DELETE CASCADE
) COMMENT = '전략 목표 (OKR) - Key Results';

-- ------------------------------------------------------------
-- 4. 로드맵
-- ------------------------------------------------------------
CREATE TABLE roadmap_items (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(300)  NOT NULL COMMENT '제목',
    description   TEXT          NULL     COMMENT '설명',
    category      VARCHAR(20)   NOT NULL DEFAULT 'feature' COMMENT 'feature|improvement|tech-debt|infrastructure|research',
    status        VARCHAR(20)   NOT NULL DEFAULT 'planned'  COMMENT 'planned|in-progress|review|done|deferred',
    priority      VARCHAR(20)   NOT NULL DEFAULT 'medium'   COMMENT 'critical|high|medium|low',
    project       VARCHAR(200)  NOT NULL COMMENT '소속 프로젝트명',
    owner         VARCHAR(100)  NOT NULL COMMENT '담당자',
    quarter       VARCHAR(10)   NOT NULL COMMENT '목표 분기 (예: 2025-Q2)',
    start_date    DATE          NULL     COMMENT '시작일',
    end_date      DATE          NULL     COMMENT '종료일',
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT = '로드맵';

-- ------------------------------------------------------------
-- 5. 투자 대비 성과 (ROI)
-- ------------------------------------------------------------
CREATE TABLE roi_items (
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    project           VARCHAR(200)  NOT NULL COMMENT '프로젝트명',
    period            VARCHAR(10)   NOT NULL COMMENT '측정 기간 (예: 2025, 2025-H1)',
    investment_cost   BIGINT        NOT NULL DEFAULT 0 COMMENT '투자 비용 (원)',
    operating_cost    BIGINT        NOT NULL DEFAULT 0 COMMENT '운영 비용 (원)',
    expected_revenue  BIGINT        NOT NULL DEFAULT 0 COMMENT '기대 수익 (원)',
    actual_revenue    BIGINT        NOT NULL DEFAULT 0 COMMENT '실제 수익 (원)',
    cost_saving       BIGINT        NOT NULL DEFAULT 0 COMMENT '비용 절감액 (원)',
    status            VARCHAR(20)   NOT NULL DEFAULT 'tracking' COMMENT 'planning|tracking|positive|negative|closed',
    owner             VARCHAR(100)  NOT NULL COMMENT '담당자',
    notes             TEXT          NULL     COMMENT '비고',
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT = '투자 대비 성과 (ROI)';
