import { ru } from '@formkit/i18n'
import { generateClasses } from '@formkit/themes'
import type { DefaultConfigOptions } from '@formkit/vue'

const generalClassification = {
  input: 'input input-bordered w-full',
  label: 'block text-sm',
  help: 'text-sm mt-1',
  messages: 'text-warning mt-1'
}

const config: DefaultConfigOptions = {
  messages: {},
  locales: { ru },
  locale: 'ru',
  config: {
    classes: generateClasses({
      text: generalClassification,
      number: { ...generalClassification, input: `${generalClassification.input} appearance-none-arrows` },
      email: generalClassification,
      password: generalClassification,
      tel: generalClassification,
      textarea: {
        ...generalClassification,
        input: 'textarea textarea-bordered focus:border-current focus:ring-0 resize-none',
      },
      select: {
        ...generalClassification,
        input: 'select select-bordered w-full',
      },
      checkbox: {
        ...generalClassification,
        wrapper: 'flex items-center gap-2 cursor-pointer',
        inner: 'flex items-center  cursor-pointer',
        input: 'checkbox',
        options: 'gap-2 flex flex-col',
      },
      radio: {
        ...generalClassification,
        input: 'radio ',
        wrapper: 'flex items-center gap-2',
        options: 'gap-2 flex flex-col',
      },
      submit: {
        input:
          'bg-primary hover:bg-primary-light text-white inline-flex gap-1 items-center justify-center py-3 px-4 text-sm font-semibold uppercase rounded outline-none focus:outline-none transition-all duration-100 disabled:opacity-70 disabled:cursor-not-allowed',
      },
      date: generalClassification,
    }),
  },
}

export default config
