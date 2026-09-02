import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#be123c',
                    hover: '#9f1239',
                    soft: '#ffe4e6',
                },
                'on-primary': '#ffffff',
                ink: '#0f172a',
                'body-text': '#334155',
                mute: '#64748b',
                hairline: '#e2e8f0',
                'hairline-strong': '#94a3b8',
                canvas: '#ffffff',
                'canvas-soft': '#f8fafc',
                'canvas-soft-2': '#f1f5f9',
                link: '#be123c',
                error: '#e11d48',
                warning: '#f59e0b',
            },
            fontFamily: {
                sans: ['Geist', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
