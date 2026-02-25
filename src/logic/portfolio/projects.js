export default {
    name: 'PortfolioProjects',
    layout: 'default',

    data() {
        return {
            title: '제품/프로젝트 목록',
            description: '제품 및 프로젝트를 등록하고 관리합니다.',
            items: [],
            loading: false,
            keyword: '',
            statusFilter: '',
            showModal: false,
            isEdit: false,
            form: {
                id: null,
                name: '',
                code: '',
                description: '',
                status: 'planning',
                priority: 'medium',
                owner: '',
                startDate: '',
                endDate: '',
                budget: 0,
                color: '#6366f1',
                members: 1
            },
            errors: {},
            isLoading: false
        };
    },

    async mounted() {
        await this.loadData();
    },

    computed: {
        filteredItems() {
            let result = this.items;
            if (this.keyword) {
                const q = this.keyword.toLowerCase();
                result = result.filter(item =>
                    item.name.toLowerCase().includes(q) ||
                    item.code.toLowerCase().includes(q) ||
                    item.owner.toLowerCase().includes(q)
                );
            }
            if (this.statusFilter) {
                result = result.filter(item => item.status === this.statusFilter);
            }
            return result;
        },
        statusOptions() {
            return [
                { value: 'planning', label: '기획중', badge: 'bg-secondary' },
                { value: 'active', label: '진행중', badge: 'bg-primary' },
                { value: 'on-hold', label: '보류', badge: 'bg-warning' },
                { value: 'completed', label: '완료', badge: 'bg-success' },
                { value: 'cancelled', label: '취소', badge: 'bg-danger' }
            ];
        },
        priorityOptions() {
            return [
                { value: 'critical', label: '긴급', badge: 'bg-danger' },
                { value: 'high', label: '높음', badge: 'bg-warning' },
                { value: 'medium', label: '보통', badge: 'bg-info' },
                { value: 'low', label: '낮음', badge: 'bg-secondary' }
            ];
        }
    },

    methods: {
        async loadData() {
            this.loading = true;
            try {
                const res = await fetch('/mock-api/portfolio/projects.json');
                this.items = await res.json();
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                this.loading = false;
            }
        },

        getStatusBadge(status) {
            const option = this.statusOptions.find(o => o.value === status);
            return option ? option.badge : 'bg-secondary';
        },

        getStatusLabel(status) {
            const option = this.statusOptions.find(o => o.value === status);
            return option ? option.label : status;
        },

        getPriorityBadge(priority) {
            const option = this.priorityOptions.find(o => o.value === priority);
            return option ? option.badge : 'bg-secondary';
        },

        getPriorityLabel(priority) {
            const option = this.priorityOptions.find(o => o.value === priority);
            return option ? option.label : priority;
        },

        formatCurrency(value) {
            if (!value) return '0';
            return new Intl.NumberFormat('ko-KR').format(value);
        },

        formatBudgetShort(value) {
            if (!value) return '0원';
            if (value >= 100000000) return (value / 100000000).toFixed(1) + '억원';
            if (value >= 10000) return (value / 10000).toFixed(0) + '만원';
            return new Intl.NumberFormat('ko-KR').format(value) + '원';
        },

        openCreateModal() {
            this.isEdit = false;
            this.form = {
                id: null,
                name: '',
                code: '',
                description: '',
                status: 'planning',
                priority: 'medium',
                owner: '',
                startDate: '',
                endDate: '',
                budget: 0,
                color: '#6366f1',
                members: 1
            };
            this.errors = {};
            this.showModal = true;
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('projectModal'));
                modal.show();
            });
        },

        openEditModal(item) {
            this.isEdit = true;
            this.form = { ...item };
            this.errors = {};
            this.showModal = true;
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('projectModal'));
                modal.show();
            });
        },

        validate() {
            this.errors = {};
            if (!this.form.name.trim()) {
                this.errors.name = '프로젝트명을 입력해주세요.';
            }
            if (!this.form.code.trim()) {
                this.errors.code = '프로젝트 코드를 입력해주세요.';
            }
            if (!this.form.owner.trim()) {
                this.errors.owner = '담당자를 입력해주세요.';
            }
            if (!this.form.startDate) {
                this.errors.startDate = '시작일을 선택해주세요.';
            }
            if (!this.form.endDate) {
                this.errors.endDate = '종료일을 선택해주세요.';
            }
            if (this.form.startDate && this.form.endDate && this.form.startDate > this.form.endDate) {
                this.errors.endDate = '종료일은 시작일 이후여야 합니다.';
            }
            return Object.keys(this.errors).length === 0;
        },

        async handleSubmit() {
            if (!this.validate()) return;
            this.isLoading = true;
            try {
                if (this.isEdit) {
                    await this.$api.put(`/api/portfolio/projects/${this.form.id}`, this.form);
                    const index = this.items.findIndex(i => i.id === this.form.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, { ...this.form });
                    }
                } else {
                    const newItem = { ...this.form, id: Date.now(), progress: 0 };
                    await this.$api.post('/api/portfolio/projects', newItem);
                    this.items.push(newItem);
                }
                this.closeModal();
            } catch (error) {
                console.error('저장 실패:', error);
                if (this.isEdit) {
                    const index = this.items.findIndex(i => i.id === this.form.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, { ...this.form });
                    }
                } else {
                    this.items.push({ ...this.form, id: Date.now(), progress: 0 });
                }
                this.closeModal();
            } finally {
                this.isLoading = false;
            }
        },

        async deleteItem(item) {
            if (!confirm(`"${item.name}" 프로젝트를 삭제하시겠습니까?`)) return;
            try {
                await this.$api.delete(`/api/portfolio/projects/${item.id}`);
                this.items = this.items.filter(i => i.id !== item.id);
            } catch (error) {
                console.error('삭제 실패:', error);
                this.items = this.items.filter(i => i.id !== item.id);
            }
        },

        closeModal() {
            const modalEl = document.getElementById('projectModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            this.showModal = false;
        },

        getProgressColor(progress) {
            if (progress >= 80) return 'bg-success';
            if (progress >= 50) return 'bg-primary';
            if (progress >= 20) return 'bg-warning';
            return 'bg-danger';
        }
    }
};
