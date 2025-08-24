// components/application-form.tsx
'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/application'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ApplicationFormProps {
  campaign: {
    id: string
    name: string
    company: string
    reward_amount: number
    requirements: string[]
  }
  onClose?: () => void
}

export function ApplicationForm({ campaign, onClose }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      campaignId: campaign.id,
      experience: 'beginner',
      expectedTraffic: 1000
    }
  })

  const experienceValue = watch('experience')

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '申請の送信に失敗しました')
      }

      setSubmitStatus('success')
      setTimeout(() => {
        onClose?.()
      }, 3000)

    } catch (error) {
      console.error('申請エラー:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : '申請の送信中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-600">申請完了！</h3>
              <p className="text-gray-600 mt-2">
                申請を受け付けました。管理者による審査後、メールでご連絡いたします。
              </p>
              <p className="text-sm text-gray-500 mt-1">
                通常、1-3営業日以内に回答いたします。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          アフィリエイト参加申請
        </CardTitle>
        <CardDescription>
          {campaign.company} - {campaign.name} (報酬: ${campaign.reward_amount})
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitStatus === 'error' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本情報</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">氏名 *</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  placeholder="田中 太郎"
                  className={errors.fullName ? 'border-red-300' : ''}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="tanaka@example.com"
                  className={errors.email ? 'border-red-300' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">電話番号</Label>
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber')}
                  placeholder="+998901234567"
                  className={errors.phoneNumber ? 'border-red-300' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="experience">経験レベル *</Label>
                <Select
                  value={experienceValue}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                    setValue('experience', value)
                  }
                >
                  <SelectTrigger className={errors.experience ? 'border-red-300' : ''}>
                    <SelectValue placeholder="経験レベルを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">初心者（0-1年）</SelectItem>
                    <SelectItem value="intermediate">中級者（1-3年）</SelectItem>
                    <SelectItem value="advanced">上級者（3年以上）</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* プラットフォーム情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">プラットフォーム情報</h3>

            <div>
              <Label htmlFor="socialMediaAccount">主要SNSアカウント *</Label>
              <Input
                id="socialMediaAccount"
                {...register('socialMediaAccount')}
                placeholder="https://instagram.com/your_account"
                className={errors.socialMediaAccount ? 'border-red-300' : ''}
              />
              {errors.socialMediaAccount && (
                <p className="text-red-500 text-sm mt-1">{errors.socialMediaAccount.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="websiteUrl">ウェブサイト/ブログURL</Label>
                <Input
                  id="websiteUrl"
                  {...register('websiteUrl')}
                  placeholder="https://your-blog.com"
                  className={errors.websiteUrl ? 'border-red-300' : ''}
                />
                {errors.websiteUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.websiteUrl.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="expectedTraffic">月間予想トラフィック *</Label>
                <Input
                  id="expectedTraffic"
                  type="number"
                  {...register('expectedTraffic', { valueAsNumber: true })}
                  placeholder="10000"
                  className={errors.expectedTraffic ? 'border-red-300' : ''}
                />
                {errors.expectedTraffic && (
                  <p className="text-red-500 text-sm mt-1">{errors.expectedTraffic.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 申請理由・追加情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">申請詳細</h3>

            <div>
              <Label htmlFor="motivation">申請理由・マーケティング戦略 *</Label>
              <Textarea
                id="motivation"
                {...register('motivation')}
                placeholder="このキャンペーンに参加したい理由と、どのような方法で商品/サービスを宣伝するかを詳しく説明してください。"
                rows={4}
                className={errors.motivation ? 'border-red-300' : ''}
              />
              {errors.motivation && (
                <p className="text-red-500 text-sm mt-1">{errors.motivation.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="additionalInfo">追加情報</Label>
              <Textarea
                id="additionalInfo"
                {...register('additionalInfo')}
                placeholder="その他、アピールしたいことがあれば記載してください。"
                rows={3}
                className={errors.additionalInfo ? 'border-red-300' : ''}
              />
              {errors.additionalInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.additionalInfo.message}</p>
              )}
            </div>
          </div>

          {/* キャンペーン要件 */}
          {campaign.requirements && campaign.requirements.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">参加要件</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {campaign.requirements.map((req, index) => (
                  <li key={index}>• {req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 送信ボタン */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  申請中...
                </>
              ) : (
                '申請を送信'
              )}
            </Button>

            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
