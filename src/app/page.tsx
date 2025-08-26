import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          UzAffiliate MVP
        </h1>
        <p className="text-gray-600 mb-8">
          手動案件申請フロー - Minimum Viable Product
        </p>

        <div className="space-x-4">
          <Link
            href="/campaigns"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            案件一覧を見る
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="font-semibold mb-2">📝 申請フロー</h2>
          <p className="text-gray-600 text-sm">
            ユーザーが案件に「参加する」→管理者にメール通知→管理者が手動承認→広告コード返信
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="font-semibold mb-2">⚡ 技術スタック</h2>
          <p className="text-gray-600 text-sm">
            Next.js App Router + Server Actions + Prisma + PostgreSQL + Resend
          </p>
        </div>
      </div>
    </div>
  )
}
