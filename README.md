# vemDeco

Portal de classificados de imóveis e serviços construído com Node.js, Express, EJS, Prisma e PostgreSQL.

## Requisitos

- Node.js 20 ou superior
- PostgreSQL 15 ou superior

## Configuração local

1. Copie `.env.example` para `.env`.
2. Troque `SESSION_SECRET` por uma chave aleatória com pelo menos 32 caracteres.
3. Ajuste `DATABASE_URL` para o banco PostgreSQL local.
4. Instale as dependências com `npm install`.
5. Aplique as migrations com `npm run db:deploy`.
6. Cadastre as categorias estruturais com `npm run db:seed`.
7. Inicie com `npm run dev`.

Sem `DATABASE_URL`, as páginas públicas continuam disponíveis para desenvolvimento visual, mas autenticação e demais fluxos persistentes respondem como indisponíveis.

Quando não existe `.env` nem `DATABASE_URL`, o desenvolvimento ativa automaticamente um modo de demonstração. Na página `/login`, use o botão **Entrar na demonstração**. Esse modo cria apenas uma sessão temporária em memória e não grava dados. Para desligá-lo localmente, defina `DEMO_MODE=false`.

### Pagamentos com Asaas Sandbox

1. Crie uma conta separada no [Sandbox do Asaas](https://docs.asaas.com/docs/sandbox) e gere uma API key de homologação.
2. Configure no `.env`:

```env
ASAAS_API_URL=https://api-sandbox.asaas.com/v3
ASAAS_API_KEY=$aact_hmlg_sua_chave
ASAAS_WEBHOOK_TOKEN=um-token-aleatorio-diferente-da-api-key-com-32-ou-mais-caracteres
```

3. Aplique a migration com `npm run db:deploy` e reinicie a aplicação.
4. No painel do Asaas, configure um Webhook apontando para `https://seu-dominio/webhooks/asaas`. Use em **Token de autenticação** exatamente o valor de `ASAAS_WEBHOOK_TOKEN` e selecione os eventos de cobrança usados pela aplicação: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `PAYMENT_REFUNDED`, `PAYMENT_CHARGEBACK_REQUESTED`, `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED` e `PAYMENT_REPROVED_BY_RISK_ANALYSIS`.

Em desenvolvimento local, confirme a cobrança no painel Sandbox e use **Atualizar status do pagamento** na página do pedido. Para testar o Webhook automaticamente, exponha a aplicação por uma URL HTTPS pública (por exemplo, com um túnel) e cadastre a URL final no Asaas; o provedor não segue redirecionamentos.

O token do Webhook não deve ser a API key. A aplicação valida o header `asaas-access-token`, registra o ID de cada evento para evitar processamento duplicado e restaura o estoque quando a cobrança é cancelada ou estornada.

Para testar cartão, selecione **Cartão de crédito** no checkout e abra a página de pagamento do Asaas. Use somente dados fictícios do Sandbox. Exemplos para aprovação: Visa `4539 6560 4839 2220`, Mastercard `5263 8372 5327 8275`, validade futura e CVV `123`. Para recusa: Mastercard `5184019740373151` ou Visa `4916561358240741`. A vemDeco não recebe nem armazena os dados do cartão.

### Bypass temporário no Render

Para publicar a demonstração antes de provisionar o PostgreSQL, configure `DEMO_MODE=true` nas variáveis de ambiente do serviço e não defina `DATABASE_URL`. O servidor usará uma chave de sessão efêmera caso `SESSION_SECRET` também não exista. Sessões e anúncios serão perdidos em reinícios, novos deploys e possivelmente entre instâncias. Remova `DEMO_MODE` assim que o banco estiver disponível.

## Comandos

- `npm run dev`: servidor de desenvolvimento com reinício automático.
- `npm start`: servidor de produção.
- `npm test`: testes automatizados.
- `npm run db:generate`: gera o Prisma Client.
- `npm run db:migrate -- --name nome_da_migration`: cria uma migration em desenvolvimento.
- `npm run db:deploy`: aplica migrations existentes sem alterar o histórico.
- `npm run db:seed`: configura as categorias básicas.

## Estrutura

- `src/routes`: definição das rotas HTTP.
- `src/controllers`: adaptação entre requisição, serviços e views.
- `src/services`: regras de negócio.
- `src/repositories`: acesso ao PostgreSQL através do Prisma.
- `src/middlewares`: autenticação, CSRF e tratamento de erros.
- `prisma`: schema, migrations e seed estrutural.
- `views`: páginas e partials EJS.
- `public`: CSS, JavaScript e imagens públicas.

Não execute `prisma migrate dev` contra produção. Em produção, utilize somente migrations revisadas com `npm run db:deploy`.
