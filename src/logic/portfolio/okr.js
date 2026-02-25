export default {
    name: 'PortfolioOkr',
    layout: 'default',

    data() {
        return {
            title: '전략 목표 (OKR)',
            description: '조직의 전략적 목표(Objectives)와 핵심 결과(Key Results)를 설정하고 추적합니다.',
            items: [],
            loading: false,
            keyword: '',
            quarterFilter: '',
            showModal: false,
            isEdit: false,
            showKrModal: false,
            isKrEdit: false,
            selectedObjectiveId: null,
            form: {
                id: null,
                objective: '',
                quarter: '',
                year: new Date().getFullYear(),
                owner: '',
                status: 'draft',
                keyResults: []
            },
            krForm: {
                id: null,
                title: '',
                metric: '',
                startValue: 0,
                targetValue: 100,
                currentValue: 0,
                unit: '%'
            },
            errors: {},
            krErrors: {},
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
                    item.objective.toLowerCase().includes(q) ||
                    item.owner.toLowerCase().includes(q)
                );
            }
            if (this.quarterFilter) {
                result = result.filter(item => item.quarter === this.quarterFilter);
            }
            return result;
        },
        quarterOptions() {
            const year = new Date().getFullYear();
            return [
                { value: `${year}-Q1`, label: `${year} Q1` },
                { value: `${year}-Q2`, label: `${year} Q2` },
                { value: `${year}-Q3`, label: `${year} Q3` },
                { value: `${year}-Q4`, label: `${year} Q4` },
                { value: `${year + 1}-Q1`, label: `${year + 1} Q1` },
                { value: `${year + 1}-Q2`, label: `${year + 1} Q2` }
            ];
        },
        statusOptions() {
            return [
                { value: 'draft', label: '초안', badge: 'bg-secondary' },
                { value: 'active', label: '진행중', badge: 'bg-primary' },
                { value: 'at-risk', label: '위험', badge: 'bg-warning' },
                { value: 'achieved', label: '달성', badge: 'bg-success' },
                { value: 'missed', label: '미달성', badge: 'bg-danger' }
            ];
        }
    },

    methods: {
        async loadData() {
            this.loading = true;
            try {
                const response = await this.$api.get('/api/portfolio/okr');
                this.items = response.data;
            } catch (error) {
                console.error('API 호출 실패, mock 데이터 로드:', error);
                const res = await fetch('/mock-api/portfolio/okr.json');
                this.items = await res.json();
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

        calcKrProgress(kr) {
            const range = Math.abs(kr.targetValue - kr.startValue);
            if (range === 0) return 100;
            const current = Math.abs(kr.currentValue - kr.startValue);
            return Math.min(100, Math.max(0, Math.round((current / range) * 100)));
        },

        calcObjectiveProgress(item) {
            if (!item.keyResults || item.keyResults.length === 0) return 0;
            const total = item.keyResults.reduce((sum, kr) => sum + this.calcKrProgress(kr), 0);
            return Math.round(total / item.keyResults.length);
        },

        getProgressColor(progress) {
            if (progress >= 70) return 'bg-success';
            if (progress >= 40) return 'bg-warning';
            return 'bg-danger';
        },

        openCreateModal() {
            this.isEdit = false;
            this.form = {
                id: null,
                objective: '',
                quarter: this.quarterOptions[0].value,
                year: new Date().getFullYear(),
                owner: '',
                status: 'draft',
                keyResults: []
            };
            this.errors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('okrModal'));
                modal.show();
            });
        },

        openEditModal(item) {
            this.isEdit = true;
            this.form = JSON.parse(JSON.stringify(item));
            this.errors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('okrModal'));
                modal.show();
            });
        },

        validate() {
            this.errors = {};
            if (!this.form.objective.trim()) {
                this.errors.objective = '목표를 입력해주세요.';
            }
            if (!this.form.quarter) {
                this.errors.quarter = '분기를 선택해주세요.';
            }
            if (!this.form.owner.trim()) {
                this.errors.owner = '담당자를 입력해주세요.';
            }
            return Object.keys(this.errors).length === 0;
        },

        async handleSubmit() {
            if (!this.validate()) return;
            this.isLoading = true;
            try {
                if (this.isEdit) {
                    await this.$api.put(`/api/portfolio/okr/${this.form.id}`, this.form);
                    const index = this.items.findIndex(i => i.id === this.form.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, JSON.parse(JSON.stringify(this.form)));
                    }
                } else {
                    const newItem = { ...this.form, id: Date.now(), keyResults: [] };
                    await this.$api.post('/api/portfolio/okr', newItem);
                    this.items.push(newItem);
                }
                this.closeModal('okrModal');
            } catch (error) {
                console.error('저장 실패:', error);
                if (this.isEdit) {
                    const index = this.items.findIndex(i => i.id === this.form.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, JSON.parse(JSON.stringify(this.form)));
                    }
                } else {
                    this.items.push({ ...this.form, id: Date.now(), keyResults: [] });
                }
                this.closeModal('okrModal');
            } finally {
                this.isLoading = false;
            }
        },

        async deleteItem(item) {
            if (!confirm(`"${item.objective}" 목표를 삭제하시겠습니까?`)) return;
            try {
                await this.$api.delete(`/api/portfolio/okr/${item.id}`);
                this.items = this.items.filter(i => i.id !== item.id);
            } catch (error) {
                console.error('삭제 실패:', error);
                this.items = this.items.filter(i => i.id !== item.id);
            }
        },

        openAddKrModal(objectiveId) {
            this.selectedObjectiveId = objectiveId;
            this.isKrEdit = false;
            this.krForm = { id: null, title: '', metric: '', startValue: 0, targetValue: 100, currentValue: 0, unit: '%' };
            this.krErrors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('krModal'));
                modal.show();
            });
        },

        openEditKrModal(objectiveId, kr) {
            this.selectedObjectiveId = objectiveId;
            this.isKrEdit = true;
            this.krForm = { ...kr };
            this.krErrors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('krModal'));
                modal.show();
            });
        },

        validateKr() {
            this.krErrors = {};
            if (!this.krForm.title.trim()) {
                this.krErrors.title = 'KR 제목을 입력해주세요.';
            }
            if (!this.krForm.metric.trim()) {
                this.krErrors.metric = '측정 지표를 입력해주세요.';
            }
            return Object.keys(this.krErrors).length === 0;
        },

        async handleKrSubmit() {
            if (!this.validateKr()) return;
            const objective = this.items.find(i => i.id === this.selectedObjectiveId);
            if (!objective) return;

            if (this.isKrEdit) {
                const krIndex = objective.keyResults.findIndex(kr => kr.id === this.krForm.id);
                if (krIndex !== -1) {
                    objective.keyResults.splice(krIndex, 1, { ...this.krForm });
                }
            } else {
                objective.keyResults.push({ ...this.krForm, id: Date.now() });
            }
            this.closeModal('krModal');
        },

        deleteKr(objectiveId, krId) {
            if (!confirm('이 핵심 결과를 삭제하시겠습니까?')) return;
            const objective = this.items.find(i => i.id === objectiveId);
            if (objective) {
                objective.keyResults = objective.keyResults.filter(kr => kr.id !== krId);
            }
        },

        closeModal(modalId) {
            const modalEl = document.getElementById(modalId);
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    }
};
