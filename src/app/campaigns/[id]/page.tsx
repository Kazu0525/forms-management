// app/campaigns/[id]/page.tsx
'use client'
import { useState } from 'react'
import { ApplicationForm } from '@/components/application-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, DollarSign, Calendar, Target } from 'lucide-react'

const mockCampaigns = {
  '1': {
    id: '1',
    name: 'Click.uz 新規登録キャンペーン',
    company: 'Click',
    reward_amount: 50,
    description: 'ウズベキスタン最大の決済サービス「Click.uz」の新規ユーザー獲得。モバイルアプリのダウンロードと初回決済完了で報酬確定。',
    category: 'フィンテック',
    status: 'active',
    requirements: [
      '18歳以上のウズベキスタン居住者への宣伝',
      'SNSアカウント登録から30日以内の初回決済必須',
      '最低フォロワー数: 1,000人以上',
      '不正な宣伝・スパム行為の禁止'
    ],
    details: {
      duration: '2024年2月1日 - 2024年3月31日',
      participants: 45,
      approvalRate: 85,
      avgPayout: 48
    }
  },
  '2': {
    id: '2',
    name: 'UzMart EC登録促進',
    company: 'UzMart',
    reward_amount: 75,
    description: 'ウズベキスタン国内最大級のECモール「UzMart」への新規会員登録と初回購入促進プログラム。',
    category: 'Eコマース',
    status: 'active',
    requirements: [
      'UzMart未登録ユーザーのみ対象',
      '登録後14日以内の初回購入必須',
      '購入金額50,000 som以上',
      'レビュー投稿必須'
    ],
    details: {
      duration: '2024年1月15日 - 2024年4月30日',
      participants: 32,
      approvalRate: 78,
      avgPayout: 72
    }
  }
}

interface CampaignDetailPageProps {
  params: {
    id: string
  }
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const campaign = mockCampaigns[params.id as keyof typeof mockCampaigns]

  if (!campaign) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">キャンペーンが見つかりません</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  if (showApplicationForm) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowApplicationForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            キャンペーン詳細に戻る
          </Button>
        </div>

        <ApplicationForm
          campaign={campaign}
          onClose={() => setShowApplicationForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {campaign.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline" className="text-blue-600">
                {campaign.company}
              </Badge>
              <Badge variant="outline" className="text-purple-600">
                {campaign.category}
              </Badge>
              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                {campaign.status === 'active' ? '募集中' : '停止中'}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${campaign.reward_amount}
            </div>
            <p className="text-gray-600">報酬額</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* 詳細説明 */}
          <Card>
            <CardHeader>
              <CardTitle>キャンペーン詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {campaign.description}
              </p>
            </CardContent>
          </Card>

          {/* 参加要件 */}
          <Card>
            <CardHeader>
              <CardTitle>参加要件</CardTitle>
              <CardDescription>
                以下の条件を満たしている方のみご参加いただけます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {campaign.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 申請ボタン */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={() => setShowApplicationForm(true)}
                disabled={campaign.status !== 'active'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                {campaign.status === 'active' ? '参加申請する' : 'キャンペーン終了'}
              </Button>
            </CardContent>
          </Card>

          {/* キャンペーン統計 */}
          <Card>
            <CardHeader>
              <CardTitle>キャンペーン統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">期間</span>
                </div>
                <span className="text-sm font-medium">
                  {campaign.details.duration}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">参加者数</span>
                </div>
                <span className="text-sm font-medium">
                  {campaign.details.participants}人
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">承認率</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {campaign.details.approvalRate}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">平均報酬</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  ${campaign.details.avgPayout}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* サポート情報 */}
          <Card>
            <CardHeader>
              <CardTitle>サポート</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <Button variant="outline" className="w-full">
                サポートに連絡
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
