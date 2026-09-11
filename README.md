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

Quando não existe `.env` nem `DATABASE_URL`, o desenvolvimento ativa automaticamente um modo de demonstração. Na página `/login`, use o botão **Entrar na demonstração**. Esse modo cria apenas uma sessão temporária em memória, não grava dados e nunca é habilitado em produção. Para desligá-lo localmente, defina `DEMO_MODE=false`.

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
