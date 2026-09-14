const bcrypt = require('bcryptjs')
const {
  PrismaClient,
  ListingKind,
  ListingStatus,
  PriceType,
  PropertyPurpose,
  UserRole,
} = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Imóveis', slug: 'imoveis', kind: ListingKind.PROPERTY, sortOrder: 1,
    subcategories: [
      { name: 'Apartamentos', slug: 'apartamentos', sortOrder: 1 },
      { name: 'Casas', slug: 'casas', sortOrder: 2 },
    ],
  },
  {
    name: 'Serviços', slug: 'servicos', kind: ListingKind.SERVICE, sortOrder: 2,
    subcategories: [
      { name: 'Reformas e manutenção', slug: 'reformas-manutencao', sortOrder: 1 },
      { name: 'Arquitetura e decoração', slug: 'arquitetura-decoracao', sortOrder: 2 },
    ],
  },
  {
    name: 'Produtos', slug: 'produtos', kind: ListingKind.PRODUCT, sortOrder: 3,
    subcategories: [
      { name: 'Móveis e decoração', slug: 'moveis-decoracao', sortOrder: 1 },
      { name: 'Eletrodomésticos', slug: 'eletrodomesticos', sortOrder: 2 },
    ],
  },
]

const users = [
  { name: 'Ana Martins', email: 'ana.imoveis@vemdeco.test', phone: '(11) 98888-1001', role: UserRole.USER },
  { name: 'Carlos Oliveira', email: 'carlos.servicos@vemdeco.test', phone: '(11) 98888-1002', role: UserRole.USER },
  { name: 'Marina Souza', email: 'marina.produtos@vemdeco.test', phone: '(11) 98888-1003', role: UserRole.USER },
]

const listings = [
  {
    ownerEmail: 'ana.imoveis@vemdeco.test', categorySlug: 'imoveis', subcategorySlug: 'apartamentos',
    kind: ListingKind.PROPERTY, title: 'Apartamento com garagem em Carapicuíba', slug: 'apartamento-garagem-carapicuiba',
    description: 'Apartamento bem iluminado com dois dormitórios, varanda, garagem coberta e fácil acesso ao centro.',
    price: '265000.00', priceType: PriceType.FIXED, featured: true, views: 128,
    location: { neighborhood: 'Cohab 5', city: 'Carapicuíba', state: 'SP', postalCode: '06329-000' },
    property: { propertyType: 'Apartamento', purpose: PropertyPurpose.SALE, bedrooms: 2, bathrooms: 2, parkingSpaces: 1, area: '56.00' },
    image: { storageKey: 'seed/listings/apartamento-carapicuiba.png', publicUrl: '/img/listings/apartamento-carapicuiba.png', altText: 'Sala iluminada de apartamento com varanda e espaço de jantar' },
  },
  {
    ownerEmail: 'ana.imoveis@vemdeco.test', categorySlug: 'imoveis', subcategorySlug: 'casas',
    kind: ListingKind.PROPERTY, title: 'Casa térrea com quintal em Osasco', slug: 'casa-terrea-quintal-osasco',
    description: 'Casa térrea com três dormitórios, quintal espaçoso, área gourmet e duas vagas de garagem.',
    price: '495000.00', priceType: PriceType.NEGOTIABLE, featured: true, views: 94,
    location: { neighborhood: 'Jaguaribe', city: 'Osasco', state: 'SP', postalCode: '06050-010' },
    property: { propertyType: 'Casa', purpose: PropertyPurpose.SALE, bedrooms: 3, bathrooms: 2, parkingSpaces: 2, area: '140.00' },
    image: { storageKey: 'seed/listings/casa-quintal-osasco.png', publicUrl: '/img/listings/casa-quintal-osasco.png', altText: 'Casa térrea com quintal, garagem e área gourmet' },
  },
  {
    ownerEmail: 'carlos.servicos@vemdeco.test', categorySlug: 'servicos', subcategorySlug: 'reformas-manutencao',
    kind: ListingKind.SERVICE, title: 'Pintura residencial e pequenos reparos', slug: 'pintura-residencial-pequenos-reparos',
    description: 'Pintura interna e externa, correção de paredes e pequenos reparos com orçamento gratuito.',
    price: '450.00', priceType: PriceType.STARTING_AT, featured: true, views: 71,
    location: { city: 'São Paulo', state: 'SP' },
    service: { serviceType: 'Pintura residencial', serviceArea: 'São Paulo e região metropolitana', contactPhone: '(11) 98888-1002', contactEmail: 'carlos.servicos@vemdeco.test', priceDetails: 'Diárias a partir de R$ 450' },
    image: { storageKey: 'seed/listings/pintura-residencial.png', publicUrl: '/img/listings/pintura-residencial.png', altText: 'Profissional realizando pintura residencial com ambiente protegido' },
  },
  {
    ownerEmail: 'carlos.servicos@vemdeco.test', categorySlug: 'servicos', subcategorySlug: 'arquitetura-decoracao',
    kind: ListingKind.SERVICE, title: 'Projeto de interiores para apartamentos', slug: 'projeto-interiores-apartamentos',
    description: 'Projeto completo de interiores com layout, paleta de materiais e acompanhamento remoto.',
    price: null, priceType: PriceType.ON_REQUEST, featured: false, views: 43,
    location: { city: 'Barueri', state: 'SP' },
    service: { serviceType: 'Design de interiores', serviceArea: 'Atendimento presencial e remoto', contactPhone: '(11) 98888-1002', contactEmail: 'carlos.servicos@vemdeco.test', priceDetails: 'Valor conforme metragem e escopo' },
    image: { storageKey: 'seed/listings/projeto-interiores.png', publicUrl: '/img/listings/projeto-interiores.png', altText: 'Projeto de interiores com planta, amostras e visualização digital' },
  },
  {
    ownerEmail: 'marina.produtos@vemdeco.test', categorySlug: 'produtos', subcategorySlug: 'moveis-decoracao',
    kind: ListingKind.PRODUCT, title: 'Mesa de jantar em madeira com seis lugares', slug: 'mesa-jantar-madeira-seis-lugares',
    description: 'Mesa de madeira maciça em ótimo estado, acompanhada de seis cadeiras estofadas.',
    price: '1850.00', priceType: PriceType.NEGOTIABLE, featured: true, views: 62,
    location: { neighborhood: 'Alphaville', city: 'Barueri', state: 'SP', postalCode: '06454-000' },
    product: { condition: 'Usado - ótimo estado', stock: 1, deliveryDetails: 'Retirada em Alphaville ou frete a combinar' },
    image: { storageKey: 'seed/products/mesa-jantar-madeira.png', publicUrl: '/img/products/mesa-jantar-madeira.png', altText: 'Mesa de jantar de madeira com seis cadeiras estofadas' },
  },
  {
    ownerEmail: 'marina.produtos@vemdeco.test', categorySlug: 'produtos', subcategorySlug: 'eletrodomesticos',
    kind: ListingKind.PRODUCT, title: 'Geladeira frost free 375 litros', slug: 'geladeira-frost-free-375-litros',
    description: 'Geladeira frost free revisada, funcionando perfeitamente e com pequenas marcas de uso.',
    price: '2100.00', priceType: PriceType.FIXED, featured: false, views: 39,
    location: { neighborhood: 'Centro', city: 'Cotia', state: 'SP', postalCode: '06700-000' },
    product: { condition: 'Usado - bom estado', stock: 1, deliveryDetails: 'Retirada em Cotia' },
    image: { storageKey: 'seed/products/geladeira-frost-free.png', publicUrl: '/img/products/geladeira-frost-free.png', altText: 'Geladeira branca frost free em uma cozinha clara' },
  },
]

async function seedCategories() {
  const saved = new Map()

  for (const category of categories) {
    const { subcategories, ...categoryData } = category
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { ...categoryData, isActive: true },
      create: categoryData,
    })

    for (const subcategory of subcategories) {
      const savedSubcategory = await prisma.subcategory.upsert({
        where: { categoryId_slug: { categoryId: savedCategory.id, slug: subcategory.slug } },
        update: { ...subcategory, isActive: true },
        create: { ...subcategory, categoryId: savedCategory.id },
      })
      saved.set(`${category.slug}/${subcategory.slug}`, savedSubcategory)
    }

    saved.set(category.slug, savedCategory)
  }

  return saved
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('VemDeco@2026', 12)
  const saved = new Map()

  for (const user of users) {
    const savedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, passwordHash, isActive: true, emailVerifiedAt: new Date() },
      create: { ...user, passwordHash, emailVerifiedAt: new Date() },
    })
    saved.set(user.email, savedUser)
  }

  return saved
}

async function seedListings(savedCategories, savedUsers) {
  for (const input of listings) {
    const { ownerEmail, categorySlug, subcategorySlug, location, property, service, product, image, ...listingData } = input
    const owner = savedUsers.get(ownerEmail)
    const category = savedCategories.get(categorySlug)
    const subcategory = savedCategories.get(`${categorySlug}/${subcategorySlug}`)
    const relationIds = { ownerId: owner.id, categoryId: category.id, subcategoryId: subcategory.id }
    const publishedAt = new Date('2026-09-11T15:00:00.000Z')

    const savedListing = await prisma.listing.upsert({
      where: { slug: listingData.slug },
      update: { ...listingData, ...relationIds, status: ListingStatus.PUBLISHED, publishedAt, deletedAt: null },
      create: { ...listingData, ...relationIds, status: ListingStatus.PUBLISHED, publishedAt },
    })

    await prisma.listingLocation.upsert({
      where: { listingId: savedListing.id },
      update: location,
      create: { ...location, listingId: savedListing.id },
    })

    if (property) {
      await prisma.propertyDetails.upsert({
        where: { listingId: savedListing.id },
        update: property,
        create: { ...property, listingId: savedListing.id },
      })
    }

    if (service) {
      await prisma.serviceDetails.upsert({
        where: { listingId: savedListing.id },
        update: service,
        create: { ...service, listingId: savedListing.id },
      })
    }

    if (product) {
      await prisma.productDetails.upsert({
        where: { listingId: savedListing.id },
        update: product,
        create: { ...product, listingId: savedListing.id },
      })
    }

    if (image) {
      await prisma.listingImage.upsert({
        where: { listingId_storageKey: { listingId: savedListing.id, storageKey: image.storageKey } },
        update: { publicUrl: image.publicUrl, altText: image.altText, position: 0 },
        create: { ...image, listingId: savedListing.id, position: 0 },
      })
    }
  }
}

async function main() {
  const savedCategories = await seedCategories()
  const savedUsers = await seedUsers()
  await seedListings(savedCategories, savedUsers)

  console.log(`Seed concluído: ${users.length} usuários e ${listings.length} anúncios configurados.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
