import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue({
            template: {
                compilerOptions: {
                  // treat all tags with a dash as custom elements
                  isCustomElement: tagName => {
                    return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
                  }
                }
            }
        })],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        
    };
});
