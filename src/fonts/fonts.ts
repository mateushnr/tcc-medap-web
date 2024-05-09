import { Roboto } from 'next/font/google'
import localFont from 'next/font/local'

export const roboto = Roboto({
  weight: ['300', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const avenir = localFont({
  src: [
    {
      path: '../assets/fonts/AvenirLTStd-Book.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/AvenirLTStd-Roman.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/AvenirLTStd-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
})
