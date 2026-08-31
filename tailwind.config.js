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
                primary: '#171717',
                ink: '#171717',
                'body-text': '#4d4d4d',
                mute: '#888888',
                hairline: '#ebebeb',
                'hairline-strong': '#a1a1a1',
                canvas: '#ffffff',
                'canvas-soft': '#fafafa',
                'canvas-soft-2': '#f5f5f5',
                link: '#0070f3',
                error: '#ee0000',
                warning: '#f5a623',
            },
            fontFamily: {
                sans: ['Geist', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
