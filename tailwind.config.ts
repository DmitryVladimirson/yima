import colors from 'tailwindcss/colors'
import forms from '@tailwindcss/forms'
import lineClamp from '@tailwindcss/line-clamp'
import typography from '@tailwindcss/typography'
import daisyUI from 'daisyui'
// eslint-disable-next-line import/no-unresolved
import tailwindcss from '@formkit/themes/tailwindcss'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './formkit.config.ts',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * General color variants
         */
        info: {
          light: colors.sky['400'],
          DEFAULT: colors.sky['500'],
          dark: colors.sky['600'],
        },
        success: {
          light: colors.lime['400'],
          DEFAULT: colors.lime['500'],
          dark: colors.lime['600'],
        },
        warning: {
          light: colors.amber['400'],
          DEFAULT: colors.amber['500'],
          dark: colors.amber['600'],
        },
        danger: {
          light: colors.red['400'],
          DEFAULT: colors.red['500'],
          dark: colors.red['600'],
        },
      },
      screens: {
        xs: '380px',
      },
      backgroundSize: {
        '50%': '50%',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: colors.gray[800],
          secondary: colors.amber[400],
          'primary-content': colors.amber[400],
          'base-content': colors.gray[800],
          neutral: colors.gray[800],
          'neutral-content': colors.white,
          'base-100': colors.white,
        },
      },
      {
        dark: {
          primary: colors.amber[400],
          secondary: colors.gray[800],
          'primary-content': colors.gray[800],
          'base-content': colors.white,
          neutral: colors.white,
          'neutral-content': colors.gray[800],
          'base-100': colors.gray[800],
        },
      },
    ],
  },
  plugins: [forms, lineClamp, typography, tailwindcss, daisyUI],
}

export default config
