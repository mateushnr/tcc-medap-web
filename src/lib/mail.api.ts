import { ContactFormData } from '@/pages/home/index.page'

export const sendContactForm = async (data: ContactFormData) =>
  fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then((res) => {
    return res.json()
  })
