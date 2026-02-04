import { mailOptions, transporter } from '@/config/nodemailer'
import { NextApiRequest, NextApiResponse } from 'next'
import { ContactFormData } from '../home/index.page'
import { CONTACT_MESSAGE_FIELDS } from '@/utils/constants/mail'

const generateEmailContent = (data: ContactFormData) => {
  const stringData = Object.entries(data).reduce((str, [key, val]) => {
    const label =
      CONTACT_MESSAGE_FIELDS[key as keyof typeof CONTACT_MESSAGE_FIELDS]
    return (str += `${label}: \n${val}} \n \n`)
  }, '')

  const htmlData = Object.entries(data).reduce((str, [key, val]) => {
    const label =
      CONTACT_MESSAGE_FIELDS[key as keyof typeof CONTACT_MESSAGE_FIELDS]

    return (str += `<h1 style="margin: 0 0 8px 0; color: #333;">${label}</h1><p style="margin: 0 0 16px 0; font-size: 16px">${val}</p>`)
  }, '')

  return {
    text: stringData,
    html: `<div style="max-width: 600px; margin: auto; border: 2px dotted #777; padding: 12px 32px;">${htmlData}</div>`,
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body as ContactFormData

    if (!data.email || !data.message) {
      return res.status(400).json({ message: 'Falha ao enviar dados do email' })
    }

    try {
      await transporter.sendMail({
        ...mailOptions,
        ...generateEmailContent(data),
        subject: 'Mensagem de contato enviada pelo site',
      })

      return res.status(200).json({ success: true, message: 'Email enviado' })
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({ success: false, message: 'Erro no envio do email' })
    }
  }

  return res
    .status(400)
    .json({ message: 'Falha ao requisitar o envio do email' })
}

export default handler
