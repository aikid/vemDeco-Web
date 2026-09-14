const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

process.env.DEMO_MODE = 'true'
process.env.DATABASE_URL = ''

const app = require('../src/app')

async function withServer(callback) {
  const server = app.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()

  try {
    await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
}

test('rotas públicas renderizam com headers de segurança', async () => {
  await withServer(async (baseUrl) => {
    for (const path of ['/', '/login', '/cadastro', '/confirmaremail', '/esquecisenha', '/produto', '/contato']) {
      const response = await fetch(`${baseUrl}${path}`)
      assert.equal(response.status, 200, path)
      assert.match(response.headers.get('content-security-policy') || '', /default-src 'self'/)
      assert.equal(response.headers.get('x-powered-by'), null)
    }
  })
})

test('imóvel de demonstração aparece na página inicial e abre sem login', async () => {
  await withServer(async (baseUrl) => {
    const home = await fetch(`${baseUrl}/`)
    const homeHtml = await home.text()
    const detailPath = homeHtml.match(/href="(\/anuncios\/demo\/demo-apartamento-carapicuiba)"/)?.[1]

    assert.equal(home.status, 200)
    assert.ok(detailPath, 'a página inicial deve conter o link do imóvel de demonstração')

    const detail = await fetch(`${baseUrl}${detailPath}`)
    assert.equal(detail.status, 200)
    assert.match(await detail.text(), /Apartamento com garagem em boa localização/)
  })
})

test('rota desconhecida usa a página 404', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/nao-existe`)
    assert.equal(response.status, 404)
    assert.match(await response.text(), /Página não encontrada/)
  })
})

test('dashboard exige autenticação', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/dashboard`, { redirect: 'manual' })
    assert.equal(response.status, 303)
    assert.match(response.headers.get('location') || '', /^\/login\?returnTo=/)
  })
})

test('formulários sensíveis exigem CSRF e não fingem autenticação sem banco', async () => {
  await withServer(async (baseUrl) => {
    const formResponse = await fetch(`${baseUrl}/login`)
    const html = await formResponse.text()
    const csrf = html.match(/name="_csrf" value="([^"]+)"/)?.[1]
    const cookie = formResponse.headers.get('set-cookie')?.split(';')[0]

    assert.ok(csrf)
    assert.ok(cookie)

    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie },
      body: new URLSearchParams({ _csrf: csrf, email: 'teste@example.com', password: 'nao-registrar' }),
    })

    assert.equal(response.status, 503)
    assert.match(await response.text(), /banco de dados ainda não foi configurado/i)
  })
})

test('requisição mutável sem token CSRF é recusada', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: 'teste@example.com', password: 'qualquer' }),
    })

    assert.equal(response.status, 403)
  })
})

test('modo demonstração cria sessão local e libera o dashboard', async () => {
  await withServer(async (baseUrl) => {
    const loginPage = await fetch(`${baseUrl}/login`)
    const html = await loginPage.text()
    const csrf = html.match(/name="_csrf" value="([^"]+)"/)?.[1]
    const initialCookie = loginPage.headers.get('set-cookie')?.split(';')[0]

    const demoLogin = await fetch(`${baseUrl}/demo/login`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: initialCookie },
      body: new URLSearchParams({ _csrf: csrf }),
    })

    assert.equal(demoLogin.status, 303)
    assert.equal(demoLogin.headers.get('location'), '/dashboard')

    const authenticatedCookie = demoLogin.headers.get('set-cookie')?.split(';')[0]
    const dashboard = await fetch(`${baseUrl}/dashboard`, { headers: { cookie: authenticatedCookie } })
    assert.equal(dashboard.status, 200)
    const dashboardHtml = await dashboard.text()
    assert.match(dashboardHtml, /modo demonstração/i)
    assert.match(dashboardHtml, /Novo produto/)

    const productForm = await fetch(`${baseUrl}/anuncios/novo?tipo=produto`, { headers: { cookie: authenticatedCookie } })
    assert.equal(productForm.status, 200)
    const productFormHtml = await productForm.text()
    assert.match(productFormHtml, /value="PRODUCT" selected/)
    assert.match(productFormHtml, /name="image" type="file"/)
  })
})

test('modo demonstração permite criar, listar e abrir um anúncio temporário', async () => {
  await withServer(async (baseUrl) => {
    const loginPage = await fetch(`${baseUrl}/login`)
    const loginHtml = await loginPage.text()
    const loginCsrf = loginHtml.match(/name="_csrf" value="([^"]+)"/)?.[1]
    const initialCookie = loginPage.headers.get('set-cookie')?.split(';')[0]
    const demoLogin = await fetch(`${baseUrl}/demo/login`, {
      method: 'POST', redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: initialCookie },
      body: new URLSearchParams({ _csrf: loginCsrf }),
    })
    const authenticatedCookie = demoLogin.headers.get('set-cookie')?.split(';')[0]

    const formPage = await fetch(`${baseUrl}/anuncios/novo`, { headers: { cookie: authenticatedCookie } })
    assert.equal(formPage.status, 200)
    const formHtml = await formPage.text()
    const formCsrf = formHtml.match(/name="_csrf" value="([^"]+)"/)?.[1]

    const listingForm = new FormData()
    const listingFields = {
      _csrf: formCsrf,
      kind: 'PROPERTY',
      title: 'Casa térrea para teste',
      description: 'Casa de demonstração com quintal e boa localização para validar o fluxo.',
      price: '420000',
      priceType: 'FIXED',
      city: 'Jundiaí',
      state: 'SP',
      propertyType: 'Casa',
      purpose: 'SALE',
      bedrooms: '3',
      bathrooms: '2',
      parkingSpaces: '2',
      area: '140',
    }
    for (const [name, value] of Object.entries(listingFields)) listingForm.append(name, value)
    const imageBuffer = fs.readFileSync(path.resolve(__dirname, '../public/img/listings/apartamento-carapicuiba.png'))
    listingForm.append('image', new Blob([imageBuffer], { type: 'image/png' }), 'apartamento.png')

    const created = await fetch(`${baseUrl}/anuncios`, {
      method: 'POST', redirect: 'manual',
      headers: { cookie: authenticatedCookie },
      body: listingForm,
    })

    assert.equal(created.status, 303)
    assert.equal(created.headers.get('location'), '/meus-anuncios')

    const listPage = await fetch(`${baseUrl}/meus-anuncios`, { headers: { cookie: authenticatedCookie } })
    const listHtml = await listPage.text()
    assert.equal(listPage.status, 200)
    assert.match(listHtml, /Casa térrea para teste/)

    const detailPath = listHtml.match(/href="(\/anuncios\/demo\/[^"]+)"/)?.[1]
    const detailPage = await fetch(`${baseUrl}${detailPath}`, { headers: { cookie: authenticatedCookie } })
    assert.equal(detailPage.status, 200)
    assert.match(await detailPage.text(), /Casa térrea para teste/)

    const listingId = detailPath.split('/').pop()
    const editPage = await fetch(`${baseUrl}/anuncios/${listingId}/editar`, { headers: { cookie: authenticatedCookie } })
    assert.equal(editPage.status, 200)
    const editHtml = await editPage.text()
    const editCsrf = editHtml.match(/name="_csrf" value="([^"]+)"/)?.[1]

    const editForm = new FormData()
    for (const [name, value] of Object.entries({ ...listingFields, _csrf: editCsrf, title: 'Casa térrea atualizada' })) {
      editForm.append(name, value)
    }
    editForm.append('image', new Blob([imageBuffer], { type: 'image/png' }), 'apartamento-carapicuiba.png')

    const updated = await fetch(`${baseUrl}/anuncios/${listingId}/editar`, {
      method: 'POST', redirect: 'manual',
      headers: { cookie: authenticatedCookie },
      body: editForm,
    })
    assert.equal(updated.status, 303)

    const updatedList = await fetch(`${baseUrl}/meus-anuncios`, { headers: { cookie: authenticatedCookie } })
    assert.match(await updatedList.text(), /Casa térrea atualizada/)

    const removed = await fetch(`${baseUrl}/anuncios/${listingId}/excluir`, {
      method: 'POST', redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: authenticatedCookie },
      body: new URLSearchParams({ _csrf: editCsrf }),
    })
    assert.equal(removed.status, 303)

    const finalList = await fetch(`${baseUrl}/meus-anuncios`, { headers: { cookie: authenticatedCookie } })
    assert.doesNotMatch(await finalList.text(), /Casa térrea atualizada/)
  })
})
