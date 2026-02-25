# CSS 스타일 규칙

적용 대상: .html, .css

## 최우선 원칙
Bootstrap 5 클래스 최대 활용, Custom CSS 최소화. 모든 커스텀 CSS는 `css/base.css`에 작성.

## 금지
- HTML 파일에 `<style>` 태그 사용 금지

## 필수
- CSS 값은 CSS 변수 사용: `var(--primary-color)`, `var(--gray-100)`
- 반응형: Bootstrap grid 사용 (`col-12 col-md-6 col-xl-3`)

## 반응형 브레이크포인트
- 모바일: `max-width: 768px`
- 태블릿: `max-width: 1024px`

## 상세 문서
색상 변수, 신호등 시스템, 주요 클래스 → `CLAUDE.md` 참조
