import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        proxy: {
            // 前端所有 /api 请求转发到本地后端 Spring Boot（端口 80）
            '/api': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
        },
    },
});
