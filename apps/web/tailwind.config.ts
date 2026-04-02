import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        peach: '#ffebd0',
        aqua: '#278783',
        aquaDark: '#1d6b68',
        aquaLight: '#34a39e',
        offWhite: '#fffdfa',
        textDark: '#1a1a1a',
        textMuted: '#666666',
      },
      boxShadow: {
        soft: '0 2px 4px rgba(0, 0, 0, 0.08)',
        glow: '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};

export default config;
