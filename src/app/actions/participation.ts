'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const participationSchema = z.object({
  campaignId: z.string().min(1, "キャンペーンIDが必要です"),
  userEmail: z.string().email("正しいメールアドレスを入力してください"),
  userName: z.string().min(1, "名前を入力してください"),
  message: z.string().min(10, "メッセージは10文字以上入力してください"),
})

export async function submitParticipation(formData: FormData) {
  try {
    const rawData = {
      campaignId: formData.get('campaignId') as string,
      userEmail: formData.get('userEmail') as string,
      userName: formData.get('userName') as string,
      message: formData.get('message') as string,
    }

    const validatedData = participationSchema.parse(rawData)

    // ユーザー取得または作成
    const user = await prisma.user.upsert({
      where: { email: validatedData.userEmail },
      update: { name: validatedData.userName },
      create: {
        email: validatedData.userEmail,
        name: validatedData.userName,
      },
    })

    // キャンペーン取得
    const campaign = await prisma.campaign.findUnique({
      where: { id: validatedData.campaignId },
    })

    if (!campaign) {
      return { success: false, error: 'キャンペーンが見つかりません' }
    }

    // 参加申請作成
    const participation = await prisma.participation.create({
      data: {
        userId: user.id,
        campaignId: validatedData.campaignId,
        message: validatedData.message,
        status: 'pending',
      },
    })

    // 管理者にメール通知
    const emailResult = await sendAdminNotification({
      userEmail: validatedData.userEmail,
      campaignTitle: campaign.title,
      message: validatedData.message,
    })

    revalidatePath('/campaigns')

    return {
      success: true,
      participationId: participation.id,
      emailSent: emailResult.success
    }

  } catch (error) {
    console.error('Participation error:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => e.message).join(', ')
      }
    }

    return {
      success: false,
      error: '申請の処理中にエラーが発生しました'
    }
  }
}
