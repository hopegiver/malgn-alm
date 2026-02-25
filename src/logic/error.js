export default {
    name: 'ErrorComponent',
    layout: null,
    props: {
        errorCode: {
            type: [String, Number],
            default: 500
        },
        errorMessage: {
            type: String,
            default: 'An error occurred.'
        },
        showRetry: {
            type: Boolean,
            default: true
        },
        showGoHome: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isRetrying: false
        }
    },
    computed: {
        errorTitle() {
            const errorTitles = {
                404: 'Page not found',
                500: 'Server error occurred',
                403: 'Access denied',
                401: 'Authentication required',
                400: 'Bad request'
            };
            return errorTitles[this.errorCode] || 'Unknown error';
        },
        errorDescription() {
            const descriptions = {
                404: 'The requested page could not be found. Please check the URL.',
                500: 'A server problem occurred. Please try again later.',
                403: 'You do not have permission to access this page.',
                401: 'This page requires login.',
                400: 'The request is not valid.'
            };
            return descriptions[this.errorCode] || this.errorMessage;
        },
        errorIcon() {
            const icons = {
                404: '🔍',
                500: '⚠️',
                403: '🚫',
                401: '🔐',
                400: '❌'
            };
            return icons[this.errorCode] || '⚠️';
        }
    },
    methods: {
        async handleRetry() {
            this.isRetrying = true;
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const currentRoute = this.getCurrentRoute();
                this.navigateTo(currentRoute || '/home');
            } catch (error) {
                console.error('Retry failed:', error);
            } finally {
                this.isRetrying = false;
            }
        },
        goHome() {
            this.navigateTo('/home');
        },
        goBack() {
            this.navigateTo('/home');
        },
        reportError() {
            // Error reporting logic (can be implemented later)
            console.log('Error report:', {
                code: this.errorCode,
                message: this.errorMessage,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
            alert('Error has been reported. We will fix it as soon as possible.');
        }
    }
}