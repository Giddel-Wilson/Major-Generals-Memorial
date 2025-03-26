import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load env files based on mode
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
        plugins: [tailwindcss(), sveltekit()],
        
        // Environment configuration
        envDir: '.',
        envPrefix: 'VITE_',
        
        // Make env variables available
        define: {
            __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL),
            __SUPABASE_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
        },

        // Existing test configuration
        test: {
            workspace: [
                {
                    extends: './vite.config.ts',
                    plugins: [svelteTesting()],
                    test: {
                        name: 'client',
                        environment: 'jsdom',
                        clearMocks: true,
                        include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                        exclude: ['src/lib/server/**'],
                        setupFiles: ['./vitest-setup-client.ts']
                    }
                },
                {
                    extends: './vite.config.ts',
                    test: {
                        name: 'server',
                        environment: 'node',
                        include: ['src/**/*.{test,spec}.{js,ts}'],
                        exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
                    }
                }
            ]
        }
    };
});