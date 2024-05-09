import { roboto } from '@/fonts/fonts'
import { globalCss } from '.'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
  },

  body: {
    '-webkit-font-smoothing': 'antialiased',
  },

  'body, input, textarea, button': {
    fontFamily: roboto.style.fontFamily,
    fontWeight: 300,
  },
})
