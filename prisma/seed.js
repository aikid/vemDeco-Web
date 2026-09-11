const { PrismaClient, ListingKind } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  { name: 'Imóveis', slug: 'imoveis', kind: ListingKind.PROPERTY, sortOrder: 1 },
  { name: 'Serviços', slug: 'servicos', kind: ListingKind.SERVICE, sortOrder: 2 },
]

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, kind: category.kind, sortOrder: category.sortOrder, isActive: true },
      create: category,
    })
  }
}

main()
  .then(() => console.log('Categorias básicas configuradas.'))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
