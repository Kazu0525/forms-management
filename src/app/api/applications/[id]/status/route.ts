// app/api/applications/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: {
    id: string
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params
    const { status, reviewNotes } = await request.json()

    // ステータス値バリデーション
    const validStatuses = ['pending', 'approved', 'rejected', 'under_review']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: '無効なステータスです'
      }, { status: 400 })
    }

    // 実際の実装ではデータベース更新
    // ここではモックの更新処理
    console.log(`申請ID: ${id} のステータスを ${status} に更新`)
    console.log('レビューノート:', reviewNotes)

    const updatedApplication = {
      id: id,
      status: status,
      reviewedAt: new Date().toISOString(),
      reviewNotes: reviewNotes || null
    }

    // ステータス変更時のメール通知（オプション）
    if (status === 'approved' || status === 'rejected') {
      // 申請者にステータス変更通知を送信
      console.log(`申請者に${status === 'approved' ? '承認' : '却下'}通知メールを送信`)
    }

    return NextResponse.json({
      success: true,
      message: 'ステータスを更新しました',
      data: updatedApplication
    })

  } catch (error) {
    console.error('ステータス更新エラー:', error)
    return NextResponse.json({
      success: false,
      error: 'ステータスの更新に失敗しました'
    }, { status: 500 })
  }
}
