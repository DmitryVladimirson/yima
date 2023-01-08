import colors from 'tailwindcss/colors'
import forms from '@tailwindcss/forms'
import lineClamp from '@tailwindcss/line-clamp'
import typography from '@tailwindcss/typography'
import daisyUI from 'daisyui'
// eslint-disable-next-line import/no-unresolved
import tailwindcss from '@formkit/themes/tailwindcss'

export default {
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
        primary: {
          light: colors.orange['500'],
          DEFAULT: colors.orange['600'],
          dark: colors.orange['700'],
        },
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
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
      },
    },
  },
  plugins: [forms, lineClamp, typography, tailwindcss, daisyUI],
}
