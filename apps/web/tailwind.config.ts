import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:      'var(--colour-navy)',
        red:       'var(--colour-red)',
        orange:    'var(--colour-orange)',
        yellow:    'var(--colour-yellow)',
        green:     'var(--colour-green)',
        stone:     'var(--colour-stone)',
        blue:      'var(--colour-blue)',
        card:      'var(--colour-bg-card)',
        sidebar:   'var(--colour-bg-sidebar)',
        page:      'var(--colour-bg-page)',
        border:    'var(--colour-border)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      spacing: {
        xs:  'var(--space-xs)',
        sm:  'var(--space-sm)',
        md:  'var(--space-md)',
        lg:  'var(--space-lg)',
        xl:  'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
      fontFamily: {
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
}

export default config