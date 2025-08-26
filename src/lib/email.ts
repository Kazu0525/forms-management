import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification({
  userEmail,
  campaignTitle,
  message
}: {
  userEmail: string;
  campaignTitle: string;
  message?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'system@uzaffiliate.com',
      to: [process.env.ADMIN_EMAIL!],
      subject: `新しい案件申請: ${campaignTitle}`,
      html: `
        <h2>新しい案件申請がありました</h2>
        <p><strong>申請者:</strong> ${userEmail}</p>
        <p><strong>案件名:</strong> ${campaignTitle}</p>
        ${message ? `<p><strong>メッセージ:</strong> ${message}</p>` : ''}
        <p><strong>申請日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}
