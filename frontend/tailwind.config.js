/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            screens: {
                mobile: '640px',
                tablet: '768px',
                laptop: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
            // fontFamily: {
            //     OpenSans: ["Open Sans", "sans-serif"],
            //     Roboto: ["Roboto", "serif"],
            //     // sans: ["var(--font-sans)", ...fontFamily.sans],
            // },
            colors: {
                background_2: '#F8FAFC', //nền này khác trắng
                footer: '#F9F8F6', // xám trắng cho footer
                lightblue: '#29ABE2', // xanh trời nhạt
                lightorange: '#DA8B24',
                superlightorange: '#FFF380',
                white: '#FFFFFF',
                gray: '#C0C0C0',
                lightgolden: '#f7efd7',
                bluelogo: '#50BAE6',
                nav: '#D8D8D8', // xám nhạt cho navbar
                navy: '#74859C', // xanh navi
                navyhover: '#7e8fa6',
                darkgray: '#5C5C5C', // xám đen
                error: '#FF0000', // đỏ
                success: '#28a745', // xanh lá\
                DEFAULT: '#000000',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            backgroundImage: {
                utemy: "url('/src/assets/images/utemy_logo_notext.png')",
                elearn: "url('/src/assets/images/free1.jpg')",
            },
        },
        borderRadius: {
            lg: `var(--radius)`,
            md: `calc(var(--radius) - 2px)`,
            sm: 'calc(var(--radius) - 4px)',
            full: '9999px',
        },
        fontFamily: {
            OpenSans: ['Open Sans', 'sans-serif'],
            Roboto: ['Roboto', 'serif'],
            sans: ['var(--font-sans)', ...fontFamily.sans],
        },
        keyframes: {
            'accordion-down': {
                from: { height: '0' },
                to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
                from: { height: 'var(--radix-accordion-content-height)' },
                to: { height: '0' },
            },
            blob: {
                '0%': {
                    transform: 'scale(1)',
                },
                '33%': {
                    transform: 'scale(1.2)',
                },
                '66%': {
                    transform: 'scale(0.8)',
                },
                '100%': {
                    transform: 'scale(1)',
                },
            },
        },
        animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
            blob: 'blob 7s infinite',
        },
    },
    plugins: [require('daisyui'), require('tailwindcss-animate')],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#087930',
                    secondary: '#FFCF90',
                    'base-100': '#fff',
                    'base-content': '#5c5c5c',
                    accent: '#FAFAFA',
                    neutral: '#000',
                },
            },
        ],
    },
};
