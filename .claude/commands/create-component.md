# 새 컴포넌트 생성

재사용 가능한 컴포넌트를 생성합니다.

## 절차

1. 사용자에게 다음을 확인:
   - 컴포넌트 이름 (PascalCase, 예: `StatusBadge`)
   - 용도 및 기능 설명
   - 필요한 props
   - 발생시킬 이벤트 (emits)

2. `.claude/templates/component.js` 템플릿을 기반으로 `src/components/{Name}.js` 생성

3. props, emits, template, methods를 사용자 요구사항에 맞게 작성

## 규칙
- 파일명은 PascalCase (예: `StatusBadge.js`)
- template 내에서 Bootstrap 5 클래스 사용
- props에 type과 default/required 명시
- emits 배열에 이벤트 선언
- 페이지에서 사용 시: `components: ['StatusBadge']` 로 등록

## 인자
$ARGUMENTS 에서 컴포넌트 이름과 설명을 파악하세요. 예: "StatusBadge 상태 표시 배지"
