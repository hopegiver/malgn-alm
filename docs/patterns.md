# 공통 패턴 (Common Patterns)

## 로딩 상태 처리

모든 비동기 데이터 로딩에 일관된 로딩 상태를 적용한다.

### logic

```javascript
data() {
    return {
        items: [],
        loading: false
    }
},

async mounted() {
    await this.loadData();
},

methods: {
    async loadData() {
        this.loading = true;
        try {
            const response = await this.$api.get('/api/items');
            this.items = response.data;
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        } finally {
            this.loading = false;
        }
    }
}
```

### view

```html
<!-- 로딩 중 -->
<div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>

<!-- 빈 상태 -->
<div v-else-if="items.length === 0" class="text-center py-5 text-secondary">
    <p class="mb-0">데이터가 없습니다.</p>
</div>

<!-- 데이터 표시 -->
<div v-else>
    <!-- 목록 렌더링 -->
</div>
```

**규칙:**
- `v-if="loading"` → `v-else-if="빈 상태"` → `v-else` 순서 고정
- spinner는 `spinner-border text-primary` 사용
- `finally` 블록에서 반드시 `loading = false` 처리

---

## 에러 처리

### API 호출 에러

```javascript
methods: {
    async loadData() {
        this.loading = true;
        try {
            const response = await this.$api.get('/api/items');
            this.items = response.data;
        } catch (error) {
            console.error('로딩 실패:', error);
        } finally {
            this.loading = false;
        }
    },

    async saveData(data) {
        this.isLoading = true;
        try {
            await this.$api.post('/api/items', data);
            this.navigateTo('/items');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다. 다시 시도해주세요.');
        } finally {
            this.isLoading = false;
        }
    },

    async deleteItem(id) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await this.$api.delete(`/api/items/${id}`);
            this.items = this.items.filter(item => item.id !== id);
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    }
}
```

**규칙:**
- 조회 실패: `console.error`만 (사용자에게 빈 상태로 표시)
- 저장/수정 실패: `console.error` + `alert`으로 사용자 알림
- 삭제: 반드시 `confirm`으로 확인 후 실행
- 모든 비동기 메서드에 `try/catch` 필수

---

## 폼 밸리데이션

### 기본 폼 패턴

```javascript
data() {
    return {
        id: this.getParam('id'),
        form: {
            title: '',
            description: '',
            email: ''
        },
        errors: {},
        isLoading: false
    }
},

computed: {
    isEdit() {
        return !!this.id;
    }
},

async mounted() {
    if (this.isEdit) {
        await this.loadItem();
    }
},

methods: {
    validate() {
        this.errors = {};
        if (!this.form.title.trim()) {
            this.errors.title = '제목을 입력해주세요.';
        }
        if (!this.form.email.trim()) {
            this.errors.email = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
            this.errors.email = '올바른 이메일 형식이 아닙니다.';
        }
        return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
        if (!this.validate()) return;
        this.isLoading = true;
        try {
            if (this.isEdit) {
                await this.$api.put(`/api/items/${this.id}`, this.form);
            } else {
                await this.$api.post('/api/items', this.form);
            }
            this.navigateTo('/items');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
        } finally {
            this.isLoading = false;
        }
    },

    async loadItem() {
        const response = await this.$api.get(`/api/items/${this.id}`);
        this.form = response.data;
    }
}
```

### 폼 view

```html
<form @submit.prevent="handleSubmit">
    <div class="mb-3">
        <label class="form-label">제목 <span class="text-danger">*</span></label>
        <input v-model="form.title" type="text" class="form-control"
               :class="{ 'is-invalid': errors.title }">
        <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
    </div>

    <div class="mb-3">
        <label class="form-label">이메일 <span class="text-danger">*</span></label>
        <input v-model="form.email" type="email" class="form-control"
               :class="{ 'is-invalid': errors.email }">
        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
    </div>

    <div class="mb-3">
        <label class="form-label">설명</label>
        <textarea v-model="form.description" class="form-control" rows="4"></textarea>
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? '저장 중...' : '저장' }}
        </button>
        <button type="button" class="btn btn-outline-secondary" @click="navigateTo('/items')">
            취소
        </button>
    </div>
</form>
```

**규칙:**
- `@submit.prevent` 필수
- 밸리데이션은 `validate()` 메서드로 분리
- 에러 표시: `is-invalid` 클래스 + `invalid-feedback`
- 필수 필드: `<span class="text-danger">*</span>` 표시
- 저장 버튼: `:disabled="isLoading"` + 텍스트 전환
- 생성/수정 분기: `isEdit` computed 사용

---

## 삭제 확인

```javascript
async deleteItem(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
        await this.$api.delete(`/api/items/${id}`);
        this.items = this.items.filter(item => item.id !== id);
    } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
    }
}
```

**규칙:** 삭제 전 반드시 `confirm()` 호출.

---

## 목록 검색/필터

```javascript
data() {
    return {
        items: [],
        keyword: ''
    }
},

computed: {
    filteredItems() {
        if (!this.keyword) return this.items;
        const q = this.keyword.toLowerCase();
        return this.items.filter(item =>
            item.title.toLowerCase().includes(q)
        );
    }
}
```

```html
<input v-model="keyword" type="text" class="form-control mb-4"
       placeholder="검색어를 입력하세요...">
<div v-for="item in filteredItems" :key="item.id">
    <!-- 항목 렌더링 -->
</div>
```

**규칙:** 클라이언트 필터링은 `computed`로 처리. 서버 검색은 `methods`에서 API 호출.
