# order-flow

Sistema de gestão de pedidos multi-tenant com autenticação completa, controle de acesso por papel (RBAC) e suporte a múltiplas organizações.

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
git clone https://github.com/seu-usuario/order-flow.git
cd order-flow
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/orderflow"
JWT_SECRET="sua-chave-secreta-longa-e-aleatoria"
ACCESS_TOKEN_TTL=900        # 15 minutos
REFRESH_TOKEN_TTL=604800    # 7 dias
```

> **Dica:** gere um JWT_SECRET seguro com `openssl rand -base64 64`

### 4. Configure o banco de dados

Execute as migrations e popule o banco com dados de exemplo:

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

### 5. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse em `http://localhost:3000`

---

## Usuários de exemplo (seed)

Após rodar o seed, os seguintes usuários estarão disponíveis:

| E-mail | Senha | Papel | Organização |
|---|---|---|---|
| `superadmin@orderflow.dev` | `123456` | Super Admin | — |
| `admin@acme-store.dev` | `123456` | Admin da Org | Acme Store |
| `customer@acme-store.dev` | `123456` | Cliente | Acme Store |

> **Atenção:** troque as senhas antes de qualquer deploy.

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Criar nova conta |
| `POST` | `/api/auth/login` | Entrar na conta |
| `POST` | `/api/auth/logout` | Encerrar sessão |
| `POST` | `/api/auth/refresh` | Renovar tokens |

#### Exemplo: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@acme-store.dev", "password": "123456"}'
```

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": 3,
      "name": "Customer",
      "email": "customer@acme-store.dev",
      "role": "CUSTOMER",
      "organizationId": 1
    }
  }
}
```

Os tokens são enviados automaticamente como cookies `HttpOnly`.

### Utilitários

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/ping` | Health check |

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

## Papéis e permissões (RBAC)

| Papel | Acesso |
|---|---|
| `SUPER_ADMIN` | Acesso total ao sistema |
| `ORG_ADMIN` | Gerencia usuários e pedidos da própria organização |
| `CUSTOMER` | Visualiza e cria seus próprios pedidos |

Rotas sob `/api/admin/*` exigem `SUPER_ADMIN`.

---

## Comandos úteis

```bash
pnpm dev                      # Servidor de desenvolvimento
pnpm build                    # Build de produção
pnpm preview                  # Preview do build

pnpm prisma migrate dev       # Rodar migrations
pnpm prisma db seed           # Popular banco com dados de exemplo
pnpm prisma studio            # Interface visual do banco
```
