export default {
    name: 'HtmlInclude',
    template: `
        <div :class="wrapperClass">
            <div v-if="loading">{{ loadingText }}</div>
            <div v-else-if="error" class="error-message">{{ errorMessage }}</div>
            <div v-else v-html="content"></div>
        </div>
    `,
    
    props: {
        src: { type: String, required: true },
        sanitize: { type: Boolean, default: true },
        loadingText: { type: String, default: 'Loading...' },
        wrapperClass: { type: String, default: 'html-include' }
    },
    
    data: () => ({
        loading: false,
        error: false,
        errorMessage: '',
        content: ''
    }),
    
    async mounted() {
        await this.load();
    },
    
    watch: {
        src: 'load'
    },
    
    methods: {
        async load() {
            if (!this.src) {
                this.handleError(new Error('No source URL provided'));
                return;
            }
            
            if (this.loading) return; // Prevent duplicate loading
            
            try {
                this.loading = true;
                this.error = false;
                
                const resolvedSrc = this.resolvePath(this.src);
                const response = await fetch(resolvedSrc);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                let content = await response.text();
                
                // Basic script sanitization
                if (this.sanitize) {
                    content = this.sanitizeHtml(content);
                }
                
                this.content = content;
                
            } catch (error) {
                this.handleError(error);
            } finally {
                this.loading = false;
            }
        },
        
        handleError(error) {
            console.warn(`HtmlInclude: Failed to load '${this.src}':`, error.message);
            this.error = true;
            this.errorMessage = error.message || `Cannot load file '${this.src}'`;
            this.content = '';
        },
        
        resolvePath(path) {
            // Return absolute URLs as-is
            if (path.startsWith('http') || path.startsWith('//')) {
                return path;
            }
            
            // Use router's resolvePath if available
            if (this.$router && typeof this.$router.resolvePath === 'function') {
                return this.$router.resolvePath(path);
            }
            
            // Fallback: basic URL resolution
            if (path.startsWith('/')) {
                return `${window.location.origin}${path}`;
            }
            
            return path;
        },
        
        sanitizeHtml(html) {
            // Basic HTML sanitization (remove script tags)
            return html.replace(/<script[^>]*>.*?<\/script>/gis, '')
                      .replace(/<script[^>]*\/>/gi, '')
                      .replace(/on\w+\s*=/gi, ''); // Remove inline event handlers
        }
    }
};