import { prisma } from '@/lib/prisma'
import ParticipationForm from '@/app/components/ParticipationForm'

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">アフィリエイト案件一覧</h1>

      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
            <p className="text-gray-600 mb-4">{campaign.description}</p>

            <ParticipationForm
              campaignId={campaign.id}
              campaignTitle={campaign.title}
            />
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          現在、アクティブな案件はありません。
        </p>
      )}
    </div>
  )
}
