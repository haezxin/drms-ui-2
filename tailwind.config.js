export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgb(var(--surface-0) / <alpha-value>)',
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
          4: 'rgb(var(--surface-4) / <alpha-value>)',
          5: 'rgb(var(--surface-5) / <alpha-value>)',
        },
        ink: {
          primary: 'rgb(var(--ink-primary) / <alpha-value>)',
          secondary: 'rgb(var(--ink-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--ink-tertiary) / <alpha-value>)',
        },
        accent: {
          critical: 'rgb(var(--accent-critical) / <alpha-value>)',
          warning: 'rgb(var(--accent-warning) / <alpha-value>)',
          normal: 'rgb(var(--accent-normal) / <alpha-value>)',
          info: 'rgb(var(--accent-info) / <alpha-value>)',
        },
        line: 'rgb(var(--ink-primary) / 0.09)',
        'line-strong': 'rgb(var(--ink-primary) / 0.16)',
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
}
