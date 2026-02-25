export default {
    name: 'PortfolioRoi',
    layout: 'default',

    data() {
        return {
            title: '투자 대비 성과',
            description: '투자 대비 성과(ROI)를 분석하고 시각화합니다.',
            items: [],
            loading: false,
            keyword: '',
            periodFilter: '',
            showModal: false,
            isEdit: false,
            form: {
                id: null,
                project: '',
                period: '',
                investmentCost: 0,
                operatingCost: 0,
                expectedRevenue: 0,
                actualRevenue: 0,
                costSaving: 0,
                status: 'tracking',
                owner: '',
                notes: ''
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
                    item.project.toLowerCase().includes(q) ||
                    item.owner.toLowerCase().includes(q)
                );
            }
            if (this.periodFilter) {
                result = result.filter(item => item.period === this.periodFilter);
            }
            return result;
        },
        periodOptions() {
            const year = new Date().getFullYear();
            return [
                { value: `${year - 1}`, label: `${year - 1}년` },
                { value: `${year}`, label: `${year}년` },
                { value: `${year}-H1`, label: `${year} 상반기` },
                { value: `${year}-H2`, label: `${year} 하반기` },
                { value: `${year + 1}`, label: `${year + 1}년` }
            ];
        },
        statusOptions() {
            return [
                { value: 'planning', label: '계획', badge: 'bg-secondary' },
                { value: 'tracking', label: '추적중', badge: 'bg-primary' },
                { value: 'positive', label: '양호', badge: 'bg-success' },
                { value: 'negative', label: '부진', badge: 'bg-danger' },
                { value: 'closed', label: '종료', badge: 'bg-dark' }
            ];
        },
        summaryStats() {
            const totalInvestment = this.filteredItems.reduce((sum, i) => sum + i.investmentCost + i.operatingCost, 0);
            const totalRevenue = this.filteredItems.reduce((sum, i) => sum + i.actualRevenue + i.costSaving, 0);
            const totalExpected = this.filteredItems.reduce((sum, i) => sum + i.expectedRevenue, 0);
            const avgRoi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment * 100) : 0;
            return { totalInvestment, totalRevenue, totalExpected, avgRoi };
        }
    },

    methods: {
        async loadData() {
            this.loading = true;
            try {
                const res = await fetch('/mock-api/portfolio/roi.json');
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

        formatCurrency(value) {
            if (!value && value !== 0) return '0';
            if (Math.abs(value) >= 100000000) {
                return (value / 100000000).toFixed(1) + '억';
            }
            if (Math.abs(value) >= 10000) {
                return (value / 10000).toFixed(0) + '만';
            }
            return new Intl.NumberFormat('ko-KR').format(value);
        },

        formatFullCurrency(value) {
            if (!value && value !== 0) return '0원';
            return new Intl.NumberFormat('ko-KR').format(value) + '원';
        },

        calcTotalCost(item) {
            return item.investmentCost + item.operatingCost;
        },

        calcTotalBenefit(item) {
            return item.actualRevenue + item.costSaving;
        },

        calcRoi(item) {
            const cost = this.calcTotalCost(item);
            if (cost === 0) return 0;
            return ((this.calcTotalBenefit(item) - cost) / cost * 100).toFixed(1);
        },

        calcAchievementRate(item) {
            if (item.expectedRevenue === 0) return 0;
            return ((this.calcTotalBenefit(item) / item.expectedRevenue) * 100).toFixed(1);
        },

        getRoiColor(roi) {
            if (roi >= 50) return 'text-success';
            if (roi >= 0) return 'text-primary';
            return 'text-danger';
        },

        openCreateModal() {
            this.isEdit = false;
            this.form = {
                id: null,
                project: '',
                period: this.periodOptions[1].value,
                investmentCost: 0,
                operatingCost: 0,
                expectedRevenue: 0,
                actualRevenue: 0,
                costSaving: 0,
                status: 'planning',
                owner: '',
                notes: ''
            };
            this.errors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('roiModal'));
                modal.show();
            });
        },

        openEditModal(item) {
            this.isEdit = true;
            this.form = { ...item };
            this.errors = {};
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('roiModal'));
                modal.show();
            });
        },

        validate() {
            this.errors = {};
            if (!this.form.project.trim()) {
                this.errors.project = '프로젝트명을 입력해주세요.';
            }
            if (!this.form.period) {
                this.errors.period = '기간을 선택해주세요.';
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
                    await this.$api.put(`/api/portfolio/roi/${this.form.id}`, this.form);
                    const index = this.items.findIndex(i => i.id === this.form.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, { ...this.form });
                    }
                } else {
                    const newItem = { ...this.form, id: Date.now() };
                    await this.$api.post('/api/portfolio/roi', newItem);
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
            if (!confirm(`"${item.project}" ROI 데이터를 삭제하시겠습니까?`)) return;
            try {
                await this.$api.delete(`/api/portfolio/roi/${item.id}`);
                this.items = this.items.filter(i => i.id !== item.id);
            } catch (error) {
                console.error('삭제 실패:', error);
                this.items = this.items.filter(i => i.id !== item.id);
            }
        },

        closeModal() {
            const modalEl = document.getElementById('roiModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    }
};
