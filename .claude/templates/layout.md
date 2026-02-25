# 레이아웃 템플릿

레이아웃 파일 위치:
- HTML: `src/views/layout/{name}.html`
- JS (선택): `src/logic/layout/{name}.js`

페이지에서 사용: `layout: '{name}'` / 레이아웃 없이: `layout: null`

핵심: `{{ content }}` 위치에 페이지 콘텐츠가 삽입됨.

---

## 1. 기본 레이아웃 (상단 네비게이션 + 푸터)

**view (layout/{name}.html):**
```html
<div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#/home">AppName</a>
            <button class="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#/home">홈</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#/about">소개</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="flex-grow-1">
        {{ content }}
    </main>

    <footer class="bg-dark text-light py-4 mt-auto">
        <div class="container text-center">
            <p class="mb-0">&copy; 2024 AppName. All rights reserved.</p>
        </div>
    </footer>
</div>
```

**logic (layout/{name}.js) - 선택사항:**
```javascript
export default {
    name: 'layoutName',
    data() {
        return {}
    },
    mounted() {},
    methods: {}
}
```

---

## 2. 사이드바 레이아웃 (관리자용)

**view:**
```html
<div class="d-flex min-vh-100">
    <aside class="bg-dark text-light p-3" style="width: 250px; min-height: 100vh;">
        <h5 class="fw-bold mb-4 text-white">관리자</h5>
        <ul class="nav flex-column gap-1">
            <li class="nav-item">
                <a class="nav-link text-light" href="#/admin/dashboard">대시보드</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-light" href="#/admin/users">사용자 관리</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-light" href="#/admin/settings">설정</a>
            </li>
        </ul>
    </aside>

    <div class="flex-grow-1">
        <header class="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0">관리자 패널</h5>
        </header>
        <main class="p-4">
            {{ content }}
        </main>
    </div>
</div>
```
