// app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { applicationSchema } from '@/lib/validations/application'
import { sendAdminNotification, sendApplicantConfirmation } from '@/lib/email'
import { z } from 'zod'

// モック用データストア（実際はデータベース使用）
const applications: any[] = []

export async function POST(request: NextRequest) {
  try {
    // リクエストボディ取得・バリデーション
    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    // 申請IDを生成
    const applicationId = 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

    // 申請データ作成
    const applicationData = {
      id: applicationId,
      ...validatedData,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewNotes: null
    }

    // データストアに保存（実際はデータベース）
    applications.push(applicationData)

    // キャンペーン情報を取得（モック）
    const mockCampaigns = {
      '1': {
        name: 'Click.uz 新規登録キャンペーン',
        company: 'Click',
        reward_amount: 50
      },
      '2': {
        name: 'UzMart EC登録促進',
        company: 'UzMart',
        reward_amount: 75
      }
    }

    const campaign = mockCampaigns[validatedData.campaignId as keyof typeof mockCampaigns] || {
      name: '不明なキャンペーン',
      company: '不明な企業',
      reward_amount: 0
    }

    // メール通知送信（並行処理）
    const [adminResult, applicantResult] = await Promise.allSettled([
      // 管理者通知メール
      sendAdminNotification({
        applicantName: validatedData.fullName,
        applicantEmail: validatedData.email,
        campaignName: campaign.name,
        campaignCompany: campaign.company,
        experience: validatedData.experience,
        socialMediaAccount: validatedData.socialMediaAccount,
        motivation: validatedData.motivation,
        expectedTraffic: validatedData.expectedTraffic,
        applicationId: applicationId,
        websiteUrl: validatedData.websiteUrl,
        phoneNumber: validatedData.phoneNumber,
        additionalInfo: validatedData.additionalInfo
      }),
      // 申請者確認メール
      sendApplicantConfirmation({
        applicantName: validatedData.fullName,
        applicantEmail: validatedData.email,
        campaignName: campaign.name,
        campaignCompany: campaign.company,
        applicationId: applicationId
      })
    ])

    // メール送信結果のログ
    if (adminResult.status === 'rejected') {
      console.error('管理者通知メール失敗:', adminResult.reason)
    }
    if (applicantResult.status === 'rejected') {
      console.error('申請者確認メール失敗:', applicantResult.reason)
    }

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      applicationId: applicationId,
      message: '申請を受け付けました。確認メールをお送りしています。',
      data: {
        id: applicationId,
        status: 'pending',
        appliedAt: applicationData.appliedAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('申請処理エラー:', error)

    // バリデーションエラー
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '入力データに問題があります',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }

    // その他のエラー
    return NextResponse.json({
      success: false,
      error: '申請の処理中にエラーが発生しました。もう一度お試しください。',
      message: 'Internal server error'
    }, { status: 500 })
  }
}

// 申請一覧取得API（管理者用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const campaignId = searchParams.get('campaignId')

    let filteredApplications = applications

    // ステータスフィルタ
    if (status) {
      filteredApplications = filteredApplications.filter(app => app.status === status)
    }

    // キャンペーンフィルタ
    if (campaignId) {
      filteredApplications = filteredApplications.filter(app => app.campaignId === campaignId)
    }

    // 申請日時順でソート
    filteredApplications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())

    return NextResponse.json({
      success: true,
      applications: filteredApplications,
      count: filteredApplications.length
    })

  } catch (error) {
    console.error('申請一覧取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: 'データの取得に失敗しました'
    }, { status: 500 })
  }
}
