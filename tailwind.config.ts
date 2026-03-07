import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        pill: '99px',
        card: '8px',
      },
      colors: {
        content: {
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          tertiary: 'var(--content-tertiary)',
          inverse: 'var(--content-inverse)',
          disabled: 'var(--content-disabled)',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          inverse: 'var(--bg-inverse)',
        },
        border: {
          opaque: 'var(--border-opaque)',
          transparent: 'var(--border-transparent)',
        },
      },
    },
  },
  plugins: [],
}

export default config
