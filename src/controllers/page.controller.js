const { demoMode } = require('../config/env')
const demoListings = require('../services/demo-listing.service')

function render(view, pageTitle, description) {
  return (req, res) => res.render(view, { pageTitle, description })
}

function unavailable(view, pageTitle, description) {
  return (req, res) => res.render(view, {
    pageTitle,
    description,
    flash: {
      type: 'error',
      title: 'Envio ainda não ativado.',
      message: 'A interface está pronta; este fluxo será conectado com segurança na etapa de autenticação e banco de dados.',
    },
  })
}

const home = (req, res) => {
  res.render('index', {
    pageTitle: 'Encontre imóveis e serviços',
    description: 'Encontre imóveis e profissionais em um só lugar.',
    search: typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 120) : '',
    featuredListings: demoMode ? [demoListings.featured()] : [],
  })
}

module.exports = {
  home,
  login: (req, res) => res.render('login', {
    pageTitle: 'Entrar',
    description: 'Acesse sua conta vemDeco.',
    returnTo: typeof req.query.returnTo === 'string' ? req.query.returnTo : '',
    values: {},
  }),
  register: (req, res) => res.render('cadastro', {
    pageTitle: 'Criar conta',
    description: 'Crie sua conta gratuita na vemDeco.',
    values: {},
  }),
  dashboard: render('dashboard', 'Minha área', 'Gerencie sua conta e seus anúncios.'),
  confirmEmail: render('confirmaremail', 'Confirmar e-mail', 'Solicite um novo link de confirmação.'),
  forgotPassword: render('esquecisenha', 'Recuperar senha', 'Solicite a recuperação da sua senha.'),
  listingDetails: render('produto', 'Apartamento em Carapicuíba', 'Detalhes do anúncio na vemDeco.'),
  contact: render('contato', 'Contato', 'Fale com a equipe vemDeco.'),
  confirmEmailUnavailable: unavailable('confirmaremail', 'Confirmar e-mail', 'Solicite um novo link de confirmação.'),
  forgotPasswordUnavailable: unavailable('esquecisenha', 'Recuperar senha', 'Solicite a recuperação da sua senha.'),
  contactUnavailable: unavailable('contato', 'Contato', 'Fale com a equipe vemDeco.'),
}
