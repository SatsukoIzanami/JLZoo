// vite.config.js
import { defineConfig } from 'vite';

// Detect GitHub Pages build by environment variable
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
    base: '/JLZoo/',
    root: '.',
    server: {
        port: 5173,
        open: true,
        proxy: {
        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true
        }
        }
    },
    build: {
        outDir: 'docs',
        emptyOutDir: true
    }
});


