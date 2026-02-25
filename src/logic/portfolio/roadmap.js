export default {
    name: 'PortfolioRoadmap',
    layout: 'default',

    data() {
        return {
            title: '로드맵',
            description: '제품 및 프로젝트의 중장기 로드맵을 관리합니다.',
            items: [],
            loading: false,
            keyword: '',
            categoryFilter: '',
            showModal: false,
            isEdit: false,
            form: {
                id: null,
                title: '',
                description: '',
                category: 'feature',
                status: 'planned',
                priority: 'medium',
                project: '',
                owner: '',
                quarter: '',
                startDate: '',
                endDate: ''
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
                    item.title.toLowerCase().includes(q) ||
                    item.project.toLowerCase().includes(q) ||
                    item.owner.toLowerCase().includes(q)
                );
            }
            if (this.categoryFilter) {
                result = result.filter(item => item.category === this.categoryFilter);
            }
            return result;
        },
        categoryOptions() {
            return [
                { value: 'feature', label: '기능', badge: 'bg-primary' },
                { value: 'improvement', label: '개선', badge: 'bg-info' },
                { value: 'tech-debt', label: '기술 부채', badge: 'bg-warning' },
                { value: 'infrastructure', label: '인프라', badge: 'bg-dark' },
                { value: 'research', label: 'R&D', badge: 'bg-secondary' }
            ];
        },
        statusOptions() {
            return [
                { value: 'planned', label: '계획', badge: 'bg-secondary' },
                { value: 'in-progress', label: '진행중', badge: 'bg-primary' },
                { value: 'review', label: '검토', badge: 'bg-info' },
                { value: 'done', label: '완료', badge: 'bg-success' },
                { value: 'deferred', label: '연기', badge: 'bg-warning' }
            ];
        },
        priorityOptions() {
            return [
                { value: 'critical', label: '긴급', badge: 'bg-danger' },
                { value: 'high', label: '높음', badge: 'bg-warning' },
                { value: 'medium', label: '보통', badge: 'bg-info' },
                { value: 'low', label: '낮음', badge: 'bg-secondary' }
            ];
        },
        quarterOptions() {
            const year = new Date().getFullYear();
            const options = [];
            for (let y = year; y <= year + 1; y++) {
                for (let q = 1; q <= 4; q++) {
                    options.push({ value: `${y}-Q${q}`, label: `${y} Q${q}` });
                }
            }
            return options;
        },
        groupedByQuarter() {
            const groups = {};
            this.filteredItems.forEach(item => {
                const key = item.quarter || '미정';
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
            });
            const sorted = Object.keys(groups).sort();
            return sorted.map(key => ({ quarter: key, items: groups[key] }));
        }
    },

    methods: {
        async loadData() {
            this.loading = true;
            try {
                const res = await fetch('/mock-api/portfolio/roadmap.json');
                this.items = await res.json();
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                this.loading = false;
            }
        },

        getCategoryBadge(category) {
            const option = this.categoryOptions.find(o => o.value === category);
            return option ? option.badge : 'bg-secondary';
        },

        getCategoryLabel(category) {
            const option = this.categoryOptions.find(o => o.value === category);
            return option ? option.label : category;
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

        openCreateModal() {
            this.isEdit = false;
            this.form = {
                id: null,
                title: '',
                description: '',
                category: 'feature',
                status: 'planned',
                priority: 'medium',
                project: '',
                owner: '',
                quarter: this.quarterOptions[0].value,
                startDate: '',
                endDate: ''
            };
            this.errors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('roadmapModal'));
                modal.show();
            });
        },

        openEditModal(item) {
            this.isEdit = true;
            this.form = { ...item };
            this.errors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('roadmapModal'));
                modal.show();
            });
        },

        validate() {
            this.errors = {};
            if (!this.form.title.trim()) {
                this.errors.title = '제목을 입력해주세요.';
            }
            if (!this.form.project.trim()) {
                this.errors.project = '프로젝트를 입력해주세요.';
            }
            if (!this.form.owner.trim()) {
                this.errors.owner = '담당자를 입력해주세요.';
            }
            if (!this.form.quarter) {
                this.errors.quarter = '분기를 선택해주세요.';
            }
            return Object.keys(this.errors).length === 0;
        },

        async handleSubmit() {
            if (!this.validate()) return;
            this.isLoading = true;
            try {
                if (this.isEdit) {
                    await this.$api.put(`/api/portfolio/roadmap/${this.form.id}`, this.form);
                    const index = this.items.findIndex(i => i.id === this.form.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, { ...this.form });
                    }
                } else {
                    const newItem = { ...this.form, id: Date.now() };
                    await this.$api.post('/api/portfolio/roadmap', newItem);
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
                    this.items.push({ ...this.form, id: Date.now() });
                }
                this.closeModal();
            } finally {
                this.isLoading = false;
            }
        },

        async deleteItem(item) {
            if (!confirm(`"${item.title}" 항목을 삭제하시겠습니까?`)) return;
            try {
                await this.$api.delete(`/api/portfolio/roadmap/${item.id}`);
                this.items = this.items.filter(i => i.id !== item.id);
            } catch (error) {
                console.error('삭제 실패:', error);
                this.items = this.items.filter(i => i.id !== item.id);
            }
        },

        closeModal() {
            const modalEl = document.getElementById('roadmapModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    }
};
