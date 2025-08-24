// lib/email-templates.tsx
import * as React from 'react'

interface AdminNotificationProps {
  applicantName: string
  applicantEmail: string
  campaignName: string
  campaignCompany: string
  experience: string
  socialMediaAccount: string
  motivation: string
  expectedTraffic: number
  applicationId: string
  websiteUrl?: string
  phoneNumber?: string
  additionalInfo?: string
}

export function AdminNotificationTemplate({
  applicantName,
  applicantEmail,
  campaignName,
  campaignCompany,
  experience,
  socialMediaAccount,
  motivation,
  expectedTraffic,
  applicationId,
  websiteUrl,
  phoneNumber,
  additionalInfo
}: AdminNotificationProps) {
  const experienceLabels = {
    beginner: '初心者（0-1年）',
    intermediate: '中級者（1-3年）',
    advanced: '上級者（3年以上）'
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#2563eb', marginBottom: '20px' }}>
          🚨 新しいアフィリエイト申請
        </h2>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h3 style={{ color: '#374151', marginBottom: '15px' }}>申請詳細</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold', width: '140px' }}>申請ID:</td>
              <td style={{ padding: '8px 0' }}>{applicationId}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>申請者名:</td>
              <td style={{ padding: '8px 0' }}>{applicantName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>メール:</td>
              <td style={{ padding: '8px 0' }}>
                <a href={`mailto:${applicantEmail}`} style={{ color: '#2563eb' }}>
                  {applicantEmail}
                </a>
              </td>
            </tr>
            {phoneNumber && (
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>電話番号:</td>
                <td style={{ padding: '8px 0' }}>{phoneNumber}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>キャンペーン:</td>
              <td style={{ padding: '8px 0' }}>{campaignCompany} - {campaignName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>経験レベル:</td>
              <td style={{ padding: '8px 0' }}>{experienceLabels[experience as keyof typeof experienceLabels]}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>SNSアカウント:</td>
              <td style={{ padding: '8px 0' }}>
                <a href={socialMediaAccount} style={{ color: '#2563eb' }}>
                  {socialMediaAccount}
                </a>
              </td>
            </tr>
            {websiteUrl && (
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>ウェブサイト:</td>
                <td style={{ padding: '8px 0' }}>
                  <a href={websiteUrl} style={{ color: '#2563eb' }}>
                    {websiteUrl}
                  </a>
                </td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>予想トラフィック:</td>
              <td style={{ padding: '8px 0' }}>{expectedTraffic.toLocaleString()}人/月</td>
            </tr>
          </table>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h3 style={{ color: '#374151', marginBottom: '15px' }}>申請理由・マーケティング戦略</h3>
          <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
            {motivation}
          </p>
        </div>

        {additionalInfo && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px' }}>追加情報</h3>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              {additionalInfo}
            </p>
          </div>
        )}

        <div style={{ backgroundColor: '#e0f2fe', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ margin: '0', color: '#0277bd', fontWeight: 'bold' }}>
            💡 管理画面で申請を確認し、承認・却下を行ってください
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
            申請日時: {new Date().toLocaleString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  )
}

// 申請者向け確認メールテンプレート
interface ApplicantConfirmationProps {
  applicantName: string
  campaignName: string
  campaignCompany: string
  applicationId: string
}

export function ApplicantConfirmationTemplate({
  applicantName,
  campaignName,
  campaignCompany,
  applicationId
}: ApplicantConfirmationProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#0ea5e9', marginBottom: '20px' }}>
          ✅ 申請を受け付けました
        </h2>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <p style={{ marginBottom: '15px' }}>
            {applicantName} 様
          </p>
          <p>
            この度は、UzAffiliateへのアフィリエイト参加申請をいただき、誠にありがとうございます。
          </p>

          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>申請内容</h3>
            <p style={{ margin: '5px 0' }}><strong>申請ID:</strong> {applicationId}</p>
            <p style={{ margin: '5px 0' }}><strong>キャンペーン:</strong> {campaignCompany} - {campaignName}</p>
            <p style={{ margin: '5px 0' }}><strong>申請日時:</strong> {new Date().toLocaleString('ja-JP')}</p>
          </div>

          <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
            現在、管理者による審査を行っております。<br />
            審査結果は、通常1-3営業日以内にメールでご連絡いたします。
          </p>

          <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <p style={{ margin: '0', color: '#92400e' }}>
              <strong>📝 審査について</strong><br />
              • 申請内容の確認<br />
              • プラットフォームの適合性チェック<br />
              • マーケティング戦略の評価
            </p>
          </div>

          <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
            ご不明な点がございましたら、いつでもお気軽にお問い合わせください。
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
            UzAffiliate チーム<br />
            support@uzaffiliate.com
          </p>
        </div>
      </div>
    </div>
  )
}
