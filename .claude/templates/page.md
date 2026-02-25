# 페이지 템플릿

페이지는 항상 **view (.html)** + **logic (.js)** 쌍으로 생성한다.
파일 경로: `src/views/{folder}/{name}.html` + `src/logic/{folder}/{name}.js`

---

## 1. 기본 페이지 (정적)

API 호출 없이 데이터만 표시하는 단순 페이지.

**logic:**
```javascript
export default {
    name: 'PageName',
    layout: 'default',
    data() {
        return {
            title: '페이지 제목',
            description: '설명 텍스트'
        }
    }
}
```

**view:**
```html
<div class="container py-4">
    <h2 class="fw-bold mb-4">{{ title }}</h2>
    <p class="text-secondary">{{ description }}</p>
</div>
```

---

## 2. 목록 페이지 (API + 로딩)

API에서 데이터를 불러와 카드/리스트로 표시. 로딩/빈 상태 처리 포함.

**logic:**
```javascript
export default {
    name: 'ItemList',
    layout: 'default',

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
}
```

**view:**
```html
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold mb-0">항목 목록</h2>
        <button class="btn btn-primary" @click="navigateTo('/items/create')">추가</button>
    </div>

    <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-5 text-secondary">
        <p class="mb-0">데이터가 없습니다.</p>
    </div>

    <div v-else class="row g-3">
        <div v-for="item in items" :key="item.id" class="col-12 col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">{{ item.title }}</h5>
                    <p class="card-text text-secondary">{{ item.description }}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <button class="btn btn-sm btn-outline-primary"
                            @click="navigateTo('/items/detail', { id: item.id })">
                        상세보기
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## 3. 상세 페이지 (파라미터 받기)

URL 파라미터로 ID를 받아 단일 항목을 로드.

**logic:**
```javascript
export default {
    name: 'ItemDetail',
    layout: 'default',

    data() {
        return {
            id: this.getParam('id'),
            item: null,
            loading: false
        }
    },

    async mounted() {
        await this.loadItem();
    },

    methods: {
        async loadItem() {
            this.loading = true;
            try {
                const response = await this.$api.get(`/api/items/${this.id}`);
                this.item = response.data;
            } catch (error) {
                console.error('로딩 실패:', error);
            } finally {
                this.loading = false;
            }
        }
    }
}
```

---

## 4. 폼 페이지 (생성/수정)

폼 제출로 데이터를 생성하거나 수정.

**logic:**
```javascript
export default {
    name: 'ItemForm',
    layout: 'default',

    data() {
        return {
            id: this.getParam('id'),
            form: {
                title: '',
                description: ''
            },
            isLoading: false
        }
    },

    async mounted() {
        if (this.id) {
            await this.loadItem();
        }
    },

    computed: {
        isEdit() {
            return !!this.id;
        }
    },

    methods: {
        async loadItem() {
            const response = await this.$api.get(`/api/items/${this.id}`);
            this.form = response.data;
        },

        async handleSubmit() {
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
            } finally {
                this.isLoading = false;
            }
        }
    }
}
```

**view:**
```html
<div class="container py-4">
    <h2 class="fw-bold mb-4">{{ isEdit ? '항목 수정' : '항목 추가' }}</h2>

    <form @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label class="form-label">제목</label>
            <input v-model="form.title" type="text" class="form-control" required>
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
</div>
```
