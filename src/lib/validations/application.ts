// lib/validations/application.ts
import { z } from 'zod'

export const applicationSchema = z.object({
  campaignId: z.string().min(1, 'キャンペーンIDは必須です'),
  fullName: z.string()
    .min(2, '氏名は2文字以上で入力してください')
    .max(50, '氏名は50文字以内で入力してください'),
  email: z.string()
    .email('正しいメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
  phoneNumber: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, '正しい電話番号を入力してください')
    .optional()
    .or(z.literal('')),
  socialMediaAccount: z.string()
    .url('正しいURLを入力してください')
    .min(1, 'SNSアカウントは必須です'),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: '経験レベルを選択してください' })
  }),
  motivation: z.string()
    .min(50, '申請理由は50文字以上入力してください')
    .max(1000, '申請理由は1000文字以内で入力してください'),
  websiteUrl: z.string()
    .url('正しいURLを入力してください')
    .optional()
    .or(z.literal('')),
  expectedTraffic: z.number()
    .min(0, '予想トラフィックは0以上の数値で入力してください')
    .max(1000000, '予想トラフィックは1,000,000以下で入力してください'),
  additionalInfo: z.string()
    .max(500, '追加情報は500文字以内で入力してください')
    .optional()
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
