import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4FBF7',
          100: '#E6F6EE',
          500: '#0D7B48',
          600: '#0A663B',
          700: '#065F46',
          800: '#064E3B',
          900: '#033A2C',
        },
        sand: {
          50: '#FAF9F5',
          100: '#F5F2EA',
          200: '#EBE5D8',
        },
        swiss: {
          red: '#E11D48',
          accent: '#DC2626',
        },
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 12px 32px -4px rgba(0, 0, 0, 0.06)',
        'soft-xl': '0 20px 48px -8px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
