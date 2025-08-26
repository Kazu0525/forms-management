'use client'

import { useState } from 'react'
import { submitParticipation } from '@/app/actions/participation'

interface ParticipationFormProps {
  campaignId: string
  campaignTitle: string
}

export default function ParticipationForm({
  campaignId,
  campaignTitle
}: ParticipationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await submitParticipation(formData)
      setResult(response)
    } catch (error) {
      setResult({ success: false, error: '送信に失敗しました' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-green-800 font-semibold mb-2">申請が完了しました！</h3>
        <p className="text-green-700">
          管理者に通知が送信されました。承認後、広告コードがメールで送信されます。
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{campaignTitle} に参加申請</h2>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="campaignId" value={campaignId} />

        <div>
          <label className="block text-sm font-medium mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="山田太郎"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="userEmail"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            申請理由・メッセージ <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={4}
            minLength={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="なぜこの案件に参加したいか、どのような媒体で紹介予定かなどを記入してください（10文字以上）"
          />
        </div>

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{result.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '参加申請する'}
        </button>
      </form>
    </div>
  )
}
