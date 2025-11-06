import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        xt: {
          blue: '#1877F2',
          blueDark: '#0d5dc7'
        }
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
}

export default config


