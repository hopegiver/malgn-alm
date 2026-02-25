export default {
    name: 'NotFoundPage',
    layout: null,
    pageTitle: '404 - Page Not Found',
    showHeader: false,
    data() {
        return {
            searchQuery: '',
            suggestedPages: [
                { name: 'Home', route: 'home', description: 'Go to main page' },
                { name: 'Components', route: 'components', description: 'View all available UI components' },
                { name: 'Contact', route: 'contact', description: 'Check contact information' }
            ],
            requestedUrl: this.getCurrentRoute() || ''
        }
    },
    methods: {
        searchSite() {
            if (this.searchQuery.trim()) {
                // Simple page search logic
                const query = this.searchQuery.toLowerCase();
                const matchedPage = this.suggestedPages.find(page => 
                    page.name.toLowerCase().includes(query) ||
                    page.description.toLowerCase().includes(query)
                );
                
                if (matchedPage) {
                    this.navigateTo(matchedPage.route);
                } else {
                    alert(`No search results for "${this.searchQuery}".`);
                }
            }
        },
        goToSuggestion(route) {
            this.navigateTo(route);
        },
        reportBrokenLink() {
            const errorInfo = {
                url: this.requestedUrl,
                referrer: document.referrer,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            console.log('Broken link report:', errorInfo);
            alert('Broken link has been reported. We will fix it as soon as possible.');
        },
        goBack() {
            this.navigateTo('/home');
        }
    }
}