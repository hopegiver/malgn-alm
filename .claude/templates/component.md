# 컴포넌트 템플릿

컴포넌트 파일 위치: `src/components/{ComponentName}.js` (PascalCase)
페이지에서 등록: `components: ['ComponentName']`

---

## 1. 기본 컴포넌트

props를 받아 렌더링하고 이벤트를 emit하는 기본 패턴.

```javascript
export default {
    name: 'StatusBadge',

    props: {
        label: {
            type: String,
            required: true
        },
        variant: {
            type: String,
            default: 'primary'    // primary, success, danger, warning
        }
    },

    emits: ['click'],

    computed: {
        badgeClass() {
            return `badge bg-${this.variant}`;
        }
    },

    methods: {
        handleClick() {
            this.$emit('click', this.label);
        }
    },

    template: `
        <span :class="badgeClass" @click="handleClick" style="cursor: pointer;">
            {{ label }}
        </span>
    `
}
```

---

## 2. 슬롯 포함 컴포넌트

자식 콘텐츠를 받아 감싸는 래퍼 컴포넌트.

```javascript
export default {
    name: 'Card',

    props: {
        title: { type: String, default: '' },
        shadow: { type: Boolean, default: true }
    },

    computed: {
        cardClass() {
            return ['card', 'h-100', this.shadow ? 'shadow-sm' : ''];
        }
    },

    template: `
        <div :class="cardClass">
            <div class="card-body">
                <h5 v-if="title" class="card-title">{{ title }}</h5>
                <slot></slot>
            </div>
            <div v-if="$slots.footer" class="card-footer bg-transparent">
                <slot name="footer"></slot>
            </div>
        </div>
    `
}
```

---

## 3. v-model 지원 컴포넌트

양방향 바인딩이 필요한 입력 컴포넌트.

```javascript
export default {
    name: 'SearchInput',

    props: {
        modelValue: { type: String, default: '' },
        placeholder: { type: String, default: '검색어를 입력하세요' }
    },

    emits: ['update:modelValue', 'search'],

    methods: {
        handleInput(event) {
            this.$emit('update:modelValue', event.target.value);
        },
        handleSearch() {
            this.$emit('search', this.modelValue);
        }
    },

    template: `
        <div class="input-group">
            <input
                type="text"
                class="form-control"
                :value="modelValue"
                :placeholder="placeholder"
                @input="handleInput"
                @keyup.enter="handleSearch" />
            <button class="btn btn-outline-primary" @click="handleSearch">검색</button>
        </div>
    `
}
```

사용: `<SearchInput v-model="keyword" @search="handleSearch" />`
