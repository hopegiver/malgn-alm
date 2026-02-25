# 새 레이아웃 생성

새로운 레이아웃 템플릿을 생성합니다.

## 절차

1. 사용자에게 다음을 확인:
   - 레이아웃 이름 (예: `admin`, `minimal`)
   - 레이아웃 구조 설명 (사이드바, 헤더, 푸터 등)
   - 네비게이션 메뉴 항목

2. `.claude/templates/layout.html` 템플릿을 기반으로 `src/views/layout/{name}.html` 생성

3. `.claude/templates/layout.js` 템플릿을 기반으로 `src/logic/layout/{name}.js` 생성

4. `{{ content }}` 플레이스홀더를 반드시 포함

## 규칙
- `{{ content }}` 위치에 페이지 컨텐츠가 삽입됨
- Bootstrap 5 클래스로 스타일링
- 페이지에서 사용: `layout: '{name}'`
- 레이아웃 없이 사용: `layout: null` (false 금지)

## 인자
$ARGUMENTS 에서 레이아웃 이름과 설명을 파악하세요. 예: "admin 관리자용 사이드바 레이아웃"
