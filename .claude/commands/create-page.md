# 새 페이지 생성

사용자가 요청한 페이지를 생성합니다.

## 절차

1. 사용자에게 다음을 확인:
   - 페이지 경로/이름 (예: `goals/my-goals`)
   - 페이지 설명 (어떤 기능의 페이지인지)
   - 레이아웃 (`default` 또는 `null`)
   - 필요한 컴포넌트 (Table, Loading 등)

2. `.claude/templates/page.js` 템플릿을 기반으로 `src/logic/{path}.js` 생성

3. `.claude/templates/page.html` 템플릿을 기반으로 `src/views/{path}.html` 생성

4. 사용자 요구사항에 맞게 data, methods, HTML 커스터마이즈

## 규칙
- view와 logic 파일명은 반드시 동일
- HTML에 `<style>` 태그 금지
- Bootstrap 5 클래스 사용
- `async/await` 패턴 사용
- 페이지 이동은 `navigateTo()` 사용

## 인자
$ARGUMENTS 에서 페이지 경로와 설명을 파악하세요. 예: "goals/my-goals 목표 관리 페이지"
