import { createStitches } from '@stitches/react'

export const {
  config,
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      // Brand colors
      brand_base: '#47B75F',

      brand_light: '#FEFFFC',
      brand_100: '#F1F3DA',
      brand_200: '#C6E1A7',
      brand_300: '#A7D88E',
      brand_400: '#84CD76',
      brand_550: '#3A9B5F',
      brand_600: '#2D7F5A',
      brand_700: '#216150',
      brand_800: '#16433F',
      brand_dark: '#0C2325',

      // Gray scale colors
      white: '#FFFFFF',
      gray_50: '#F9F9F9',
      gray_100: '#EFEFEF',
      gray_200: '#DBDBDB',
      gray_300: '#CBCBCB',
      gray_400: '#B6B6B6',
      gray_500: '#838383',
      gray_600: '#585858',
      gray_700: '#393939',
      gray_800: '#212121',
      gray_900: '#121212',
      black: '#000000',

      // Feedback colors
      danger_200: '#FECACA',
      danger_400: '#F77272',
      danger_500: '#EE4545',
      danger_600: '#DB2929',
      danger_700: '#B81D1D',

      warning_100: '#FCF3C5',
      warning_300: '#F7D14D',
      warning_400: '#F2B91C',
      warning_500: '#E2A110',
      warning_700: '#C37C0B',

      // Gradients
      gradient_brand_base:
        'linear-gradient(to bottom, #5EC261 0%, #47B75F 50%, #3A9B5F 100%);',
      gradient_brand_base_inverse:
        'linear-gradient(to bottom, #2D7F5A 0%, #3A9B5F 50%, #47B75F 100%);',
      gradient_brand_dark:
        'linear-gradient(to bottom, #0C2325 0%, #16433F 50%, #216150 100%);',

      spacing_300: 300,
    },
  },
})
