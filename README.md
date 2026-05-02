# foundation

Template base para aplicações full-stack com autenticação completa, RBAC e painel admin. Construído para ser clonado e estendido com os domínios específicos de cada projeto.

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
```

> Gere um JWT_SECRET seguro com `openssl rand -base64 64`

### 4. Configure o banco de dados

```bash
pnpm prisma migrate dev
pnpm prisma db seed
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

### Autenticação

| Método | Rota                 | Descrição        |
| ------ | -------------------- | ---------------- |
| `POST` | `/api/auth/register` | Criar nova conta |
| `POST` | `/api/auth/login`    | Entrar na conta  |
| `POST` | `/api/auth/logout`   | Encerrar sessão  |
| `POST` | `/api/auth/refresh`  | Renovar tokens   |

### Utilitários

| Método | Rota        | Descrição    |
| ------ | ----------- | ------------ |
| `GET`  | `/api/ping` | Health check |

Os tokens são enviados automaticamente como cookies `HttpOnly`.

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

## Papéis

| Papel         | Acesso                       |
| ------------- | ---------------------------- |
| `SUPER_ADMIN` | Acesso total ao sistema      |
| `ADMIN`       | Acesso administrativo padrão |
| `USER`        | Acesso de usuário comum      |

Rotas sob `/api/admin/*` exigem `SUPER_ADMIN`.

---

## Comandos úteis

```bash
pnpm dev                      # Servidor de desenvolvimento
pnpm build                    # Build de produção
pnpm preview                  # Preview do build

pnpm prisma migrate dev       # Rodar migrations
pnpm prisma db seed           # Popular banco com dados padrão
pnpm prisma studio            # Interface visual do banco
```
