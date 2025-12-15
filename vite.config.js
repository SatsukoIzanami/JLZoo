// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Detect GitHub Pages build by environment variable
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
    base: isGitHubPages ? '/JLZoo/' : '/',   //root locally, subpath on GH Pages
    root: '.',
    publicDir: 'public',
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
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html')
            }
        }
    }
});

