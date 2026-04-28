import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.resolve(__dirname, '../dev.db')}`,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Admin kullanıcısı — ADMIN rolü ile
  const adminHash = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'admin@toployalty.com' },
    update: {
      passwordHash: adminHash,
      name: 'Super Admin',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@toployalty.com',
      passwordHash: adminHash,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  })

  // Eski admin kaydını da güncelle (varsa)
  const oldAdmin = await prisma.adminUser.findUnique({
    where: { email: 'admin@toployalty.io' },
  })
  if (oldAdmin) {
    await prisma.adminUser.update({
      where: { email: 'admin@toployalty.io' },
      data: { role: 'ADMIN' },
    })
  }

  // Senaryo
  await prisma.scenario.upsert({
    where: { slug: 'maps-forward-with-award' },
    update: {},
    create: {
      name: 'MapsForwardWithAward',
      slug: 'maps-forward-with-award',
      description: 'Müşteri Google Maps yorumu bırakır, ekran görüntüsü yükler, AI doğrular, ödül kazanır.',
    },
  })

  console.log('Seed tamamlandı.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
