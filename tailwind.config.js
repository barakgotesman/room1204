/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Stitch Room1204 design system palette
        bg:             '#16130f',
        surface:        '#221f1b',
        'surface-low':  '#1e1b17',
        'surface-high': '#2d2925',
        'surface-top':  '#38342f',
        border:         '#4d463a',
        'border-dim':   '#2d2925',
        accent:         '#c8a96e',
        'accent-bright':'#e5c487',
        'accent-dim':   '#7a6540',
        danger:         '#ffb4ab',
        'danger-bg':    '#93000a',
        success:        '#4caf7d',
        muted:          '#998f81',
        'text-dim':     '#d0c5b5',
        'code-bg':      '#100e0a',
        secondary:      '#c5c4dc',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"Lora"', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
