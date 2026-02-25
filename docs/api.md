# API 호출 ($api)

## 기본 메서드

```javascript
// GET
const users = await this.$api.get('/api/users');
const filtered = await this.$api.get('/api/users', {
    params: { role: 'admin', active: true }
});

// POST
const created = await this.$api.post('/api/users', {
    name: 'John', email: 'john@example.com'
});

// PUT (전체 수정)
const updated = await this.$api.put('/api/users/123', { name: 'John Doe' });

// PATCH (부분 수정)
const patched = await this.$api.patch('/api/users/123', { email: 'new@example.com' });

// DELETE
const deleted = await this.$api.delete('/api/users/123');

// 커스텀 헤더
const response = await this.$api.get('/api/data', {
    headers: { 'X-Custom-Header': 'value' }
});
```

## 에러 처리

```javascript
methods: {
    async fetchData() {
        try {
            const response = await this.$api.get('/api/data');
            this.data = response.data;
        } catch (error) {
            if (error.response) {
                // 서버 응답 있음 (4xx, 5xx)
                console.error('상태 코드:', error.response.status);
                console.error('에러 메시지:', error.response.data);
            } else if (error.request) {
                // 요청은 갔으나 응답 없음
                console.error('서버 응답 없음');
            } else {
                // 요청 설정 중 오류
                console.error('요청 오류:', error.message);
            }
        }
    }
}
```

## 자동 토큰 주입

인증 활성화 시(`authEnabled: true`) 모든 API 요청에 자동으로 토큰 포함:
```
Authorization: Bearer YOUR_TOKEN
```
