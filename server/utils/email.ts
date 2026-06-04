import { Resend } from 'resend'
import { AppError } from './errors'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new AppError('MISSING_RESEND_KEY', 'RESEND_API_KEY nao configurado', 500)
  return new Resend(apiKey)
}

function getEmailFrom() {
  return process.env.EMAIL_FROM ?? 'noreply@foundation.dev'
}

function getAppUrl() {
  const url = process.env.PUBLIC_APP_URL
  if (!url) throw new AppError('MISSING_APP_URL', 'PUBLIC_APP_URL nao configurado', 500)
  return url.replace(/\/$/, '')
}

export async function sendPasswordResetEmail(to: string, rawToken: string) {
  const resend = getResend()
  const url = `${getAppUrl()}/redefinir-senha?token=${rawToken}`
  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject: 'Redefinição de senha',
    html: `
      <p>Olá,</p>
      <p>Clique no link abaixo para redefinir sua senha. O link expira em <strong>1 hora</strong>.</p>
      <p><a href="${url}">${url}</a></p>
      <p>Se você não solicitou a redefinição, ignore este e-mail.</p>
    `,
  })

  if (error) {
    console.error('[email] Resend retornou erro:', JSON.stringify(error))
    throw new AppError('EMAIL_SEND_FAILED', 'Falha ao enviar e-mail de redefinicao de senha', 500)
  }
}

export async function sendVerificationEmail(to: string, rawToken: string) {
  const resend = getResend()
  const url = `${getAppUrl()}/verificar-email?token=${rawToken}`
  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject: 'Verifique seu e-mail',
    html: `
      <p>Olá,</p>
      <p>Clique no link abaixo para verificar seu e-mail. O link expira em <strong>24 horas</strong>.</p>
      <p><a href="${url}">${url}</a></p>
      <p>Se você não criou uma conta, ignore este e-mail.</p>
    `,
  })

  if (error) {
    console.error('[email] Resend retornou erro:', JSON.stringify(error))
    throw new AppError('EMAIL_SEND_FAILED', 'Falha ao enviar e-mail de verificacao', 500)
  }
}
