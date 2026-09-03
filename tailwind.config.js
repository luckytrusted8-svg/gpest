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
                    DEFAULT: '#0f172a',
                    hover: '#1e293b',
                    soft: '#f1f5f9',
                },
                'on-primary': '#ffffff',
                obsidian: '#090d16',
                ink: '#090d16',
                body: '#334155',
                'body-text': '#334155',
                mute: '#64748b',
                subtle: '#94a3b8',
                hairline: '#e2e8f0',
                'hairline-light': '#f1f5f9',
                canvas: '#ffffff',
                'canvas-soft': '#f8fafc',
                'canvas-soft-2': '#f1f5f9',
                success: {
                    DEFAULT: '#10b981',
                    soft: '#f0fdf4',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    soft: '#fffbeb',
                },
                error: {
                    DEFAULT: '#ef4444',
                    soft: '#fef2f2',
                },
            },
            fontFamily: {
                sans: ['Geist', 'Inter', ...defaultTheme.fontFamily.sans],
                mono: ['Geist Mono', ...defaultTheme.fontFamily.mono],
            },
            borderRadius: {
                'xs': '4px',
                'sm': '6px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
                '3xl': '28px',
                'pill': '100px',
            },
            boxShadow: {
                'ambient': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                'ambient-lg': '0 20px 40px -10px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                'island': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.06)',
            }
        },
    },

    plugins: [forms],
};
