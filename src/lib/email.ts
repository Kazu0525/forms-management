// lib/email.ts
import { Resend } from 'resend'
import { AdminNotificationTemplate, ApplicantConfirmationTemplate } from './email-templates'
import { render } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendAdminNotificationParams {
  applicantName: string
  applicantEmail: string
  campaignName: string
  campaignCompany: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  socialMediaAccount: string
  motivation: string
  expectedTraffic: number
  applicationId: string
  websiteUrl?: string
  phoneNumber?: string
  additionalInfo?: string
}

export async function sendAdminNotification(params: SendAdminNotificationParams) {
  try {
    const emailHtml = await render(AdminNotificationTemplate(params))

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@uzaffiliate.com',
      to: process.env.ADMIN_EMAIL || 'admin@uzaffiliate.com',
      subject: `🚨 新規申請: ${params.campaignName} - ${params.applicantName}`,
      html: emailHtml,
      replyTo: params.applicantEmail,
    })

    if (error) {
      console.error('管理者通知メール送信エラー:', error)
      return { success: false, error }
    }

    console.log('管理者通知メール送信成功:', data)
    return { success: true, data }

  } catch (error) {
    console.error('メール送信処理エラー:', error)
    return { success: false, error }
  }
}

interface SendApplicantConfirmationParams {
  applicantName: string
  applicantEmail: string
  campaignName: string
  campaignCompany: string
  applicationId: string
}

export async function sendApplicantConfirmation(params: SendApplicantConfirmationParams) {
  try {
    const emailHtml = await render(ApplicantConfirmationTemplate(params))

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@uzaffiliate.com',
      to: params.applicantEmail,
      subject: `✅ 申請受付完了 - ${params.campaignName}`,
      html: emailHtml,
    })

    if (error) {
      console.error('申請者確認メール送信エラー:', error)
      return { success: false, error }
    }

    console.log('申請者確認メール送信成功:', data)
    return { success: true, data }

  } catch (error) {
    console.error('申請者メール送信処理エラー:', error)
    return { success: false, error }
  }
}
