const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // サンプルキャンペーン作成
  const campaign1 = await prisma.campaign.create({
    data: {
      title: 'テスト案件：健康食品アフィリエイト',
      description: '人気の健康食品を紹介して報酬を獲得しましょう。承認率90%以上の優良案件です。',
      status: 'active',
    },
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      title: 'テスト案件：オンライン英会話紹介',
      description: 'オンライン英会話サービスの新規会員紹介プログラムです。高単価報酬設定。',
      status: 'active',
    },
  })

  console.log(`Created campaigns: ${campaign1.id}, ${campaign2.id}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
