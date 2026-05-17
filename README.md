# foundation

![Logo foundation](./public/logo.svg)

Template base para aplicações full-stack com autenticação completa, RBAC e painel admin. Construído para ser clonado e estendido com os domínios específicos de cada projeto.

## Documentação

- [Roadmap do projeto](./docs/ROADMAP.md): lista as etapas planejadas, status de execução e próximos blocos de trabalho (auth, RBAC, admin etc.).
- [Guia de RBAC](./docs/RBAC.md): explica como permissões funcionam no backend, como adicionar novas permissões e como operar seed/migrações em produção.

## Stack

- **Framework:** [Nuxt 4](https://nuxt.com) + [Nitro](https://nitro.unjs.io)
- **Frontend:** Vue 3, [Nuxt UI](https://ui.nuxt.com), Tailwind CSS 4, Pinia
- **Backend:** Nitro (server routes, middleware, plugins)
- **Banco de dados:** PostgreSQL + [Prisma ORM](https://www.prisma.io)
- **Autenticação:** JWT (access + refresh token), cookies HttpOnly
- **Segurança:** Argon2 para hash de senhas, tokens rotativos, sessões revogáveis

## Requisitos

- Node.js 20+
- pnpm 10+
- PostgreSQL 15+

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/foundation.git
cd foundation
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nuxt_starter"
JWT_SECRET="sua-chave-secreta-longa-e-aleatoria"
ACCESS_TOKEN_TTL=900        # 15 minutos
REFRESH_TOKEN_TTL=604800    # 7 dias

RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@seudominio.com"
PUBLIC_APP_URL="http://localhost:3000"
```

> Gere um JWT_SECRET seguro com `openssl rand -base64 64`

### 4. Configure o banco de dados

```bash
pnpm prisma:migrate
pnpm prisma:seed
```

### 5. Inicie o servidor

```bash
pnpm dev
```

Acesse em `http://localhost:3000`

---

## Usuários padrão (seed)

| E-mail              | Senha    | Papel         |
| ------------------- | -------- | ------------- |
| `admin@starter.dev` | `123456` | Super Admin   |
| `user@starter.dev`  | `123456` | Usuário comum |

> Troque as senhas antes de qualquer deploy.

---

## Endpoints da API

### Autenticação (`/api/auth`)

| Método | Rota                 | Descrição                                                               |
| ------ | -------------------- | ----------------------------------------------------------------------- |
| `POST` | `/api/auth/register`              | Criar nova conta e iniciar sessão                                       |
| `POST` | `/api/auth/login`                 | Entrar na conta e iniciar sessão                                        |
| `POST` | `/api/auth/logout`                | Encerrar sessão atual (revoga refresh da sessão)                        |
| `POST` | `/api/auth/refresh`               | Rotacionar tokens e sessão (com proteção contra reutilização)           |
| `GET`  | `/api/auth/me`                    | Retornar utilizador autenticado da sessão atual (sanitizado, sem senha) |
| `POST` | `/api/auth/verify-email`          | Verificar e-mail com token recebido por e-mail (TTL: 24h)               |
| `POST` | `/api/auth/resend-verification`   | Reenviar e-mail de verificação (requer autenticação)                    |

> Os tokens são enviados automaticamente como cookies `HttpOnly`.
> Em caso de reutilização de refresh token, todas as sessões ativas do utilizador são revogadas.

### Painel admin (`/api/protected/admin`)

Todas as rotas abaixo exigem sessão válida e permissão de admin no backend (`SUPER_ADMIN`).

| Método   | Rota                                  | Descrição                                              |
| -------- | ------------------------------------- | ------------------------------------------------------ |
| `GET`    | `/api/protected/admin/permissions`                    | Listar catálogo de permissões                          |
| `GET`    | `/api/protected/admin/roles`                          | Listar papéis e permissões associadas                  |
| `GET`    | `/api/protected/admin/users`                          | Listar utilizadores com paginação e busca (`pageSize`) |
| `PATCH`  | `/api/protected/admin/users/:id/role`                 | Atualizar papel do utilizador                          |
| `POST`   | `/api/protected/admin/users/:id/resend-verification`  | Reenviar e-mail de verificação para um utilizador      |
| `GET`    | `/api/protected/admin/sessions`                       | Listar sessões ativas com paginação                    |
| `DELETE` | `/api/protected/admin/sessions/:id`                   | Revogar sessão específica                              |

### Utilitário público

| Método | Rota        | Descrição          |
| ------ | ----------- | ------------------ |
| `GET`  | `/api/ping` | Health check geral |

---

## Arquitetura do servidor

```
server/
├── api/           # Rotas HTTP (Nitro file-based routing)
│   └── auth/      # Endpoints de autenticação
├── middleware/    # Auth passivo + proteção de rotas admin
├── plugins/       # Inicialização do banco de dados
├── repositories/  # Acesso ao banco via Prisma
├── schemas/       # Validação com Zod
├── services/      # Lógica de negócio
├── types/         # Tipos globais (ex: H3EventContext)
└── utils/         # JWT, cookies, erros, resposta padrão
```

Toda requisição segue a cadeia: `rota → service → repository → banco`

---

## Como funciona o frontend

### Estrutura de UI

- `app/pages/*`: páginas finas (meta, SEO e middleware)
- `app/components/templates/*`: conteúdo das rotas
- `app/components/organisms/*`: blocos funcionais (admin, home, etc.)
- `app/components/atoms/*`: peças reutilizáveis (`AtomsRoleBadge`, `AtomsTable`)

### Estado de autenticação

- store central em `app/stores/auth.ts`
- estado principal: `user`, `isAuthenticated`, `role`, `sessionChecked`
- ações: `login`, `register`, `logout`, `fetchMe`, `ensureSession`

### Camada de API no frontend

- `useApi()` é o ponto único para módulos (`auth`, `admin`)
- `useApiBase()` aplica:
  - `credentials: 'include'`
  - reenvio de cookies no SSR
  - normalização de erros
  - interceptor de `401` com refresh automático

### Fluxo de refresh no cliente

Quando uma requisição retorna `401`:

1. tenta `POST /api/auth/refresh`
2. se funcionar, repete a requisição original
3. se falhar, limpa sessão local, mostra toast de sessão expirada e redireciona para `/entrar` com `redirect` seguro

### Middleware de rotas

- `auth.ts`: bloqueia rotas privadas para anónimos
- `guest.ts`: bloqueia rotas de login/cadastro para autenticados
- `admin.ts`: redireciona para `/` quem não for `SUPER_ADMIN`

### Listagens admin (tabela + paginação)

- `usePaginated()` centraliza:
  - estado de paginação
  - loading/erro
  - execução do request
  - debounce de busca
- `AtomsTable` centraliza:
  - busca por `pagination.search`
  - loading e empty state
  - paginação (`UPagination`)
  - coluna de ações por linha (dropdown)
  - slots por coluna (`role-[key]`)

---

## Papéis

| Papel         | Acesso                       |
| ------------- | ---------------------------- |
| `SUPER_ADMIN` | Acesso total ao sistema      |
| `ADMIN`       | Acesso administrativo padrão |
| `USER`        | Acesso de usuário comum      |

Rotas sob `/api/protected/admin/*` exigem sessão válida e permissões de painel admin (ver `docs/RBAC.md`).

---

## Comandos úteis

```bash
pnpm dev                # Servidor de desenvolvimento
pnpm build              # Build de produção
pnpm preview            # Preview do build
pnpm typecheck          # Verificar tipos TypeScript
pnpm lint               # ESLint
pnpm format             # Prettier

pnpm prisma:migrate     # Criar e aplicar migrations
pnpm prisma:seed        # Popular banco com dados padrão
pnpm prisma:generate    # Regenerar Prisma Client
pnpm prisma:studio      # Interface visual do banco
```

## Testes manuais de API

Os arquivos em `requests/` cobrem os fluxos principais com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) do VS Code.

```bash
cp requests/.env.example requests/.env
# Edite requests/.env se necessário (credenciais do seed já preenchidas)
```

Abra qualquer `.http` e clique em **Send Request** acima de cada bloco. Os cookies de autenticação são gerenciados automaticamente por host — basta executar o login antes das rotas protegidas.
