# foundation

Template base para aplicações full-stack com autenticação completa, RBAC e painel admin.

## Stack

- Nuxt 4 + Nitro, Vue 3, Pinia
- Prisma + PostgreSQL
- Nuxt UI + Tailwind CSS 4
- Zod para validação
- Argon2 para hash de senha
- Jose para JWT

## Arquitetura do servidor

Sempre seguir a cadeia: `routes → services → repositories → Prisma`

- **Routes** (`server/api/`): apenas leitura de body/params, validação e resposta
- **Services** (`server/services/`): lógica de negócio
- **Repositories** (`server/repositories/`): acesso ao banco via Prisma
- **Schemas** (`server/schemas/`): validação com Zod
- **Utils** (`server/utils/`): helpers reutilizáveis (jwt, cookies, errors, response)

## Convenções de código

- Respostas de sucesso: `ok(data)` de `~/server/utils/response` — retorna o payload direto no JSON (sem `{ ok, data }`); status opcional `ok(data, codigo, event)` quando diferente de 200
- Erros: lançar `AppError` e converter com `toHttpError()` no handler
- Nunca expor `passwordHash` em respostas
- Comentários e mensagens de erro em português

### Parâmetros de funções e métodos

Funções e métodos com um ou mais parâmetros primitivos devem sempre recebê-los como um único objeto desestruturado. Aplica-se a services, repositories, utils e qualquer outra camada:

```ts
// ✓ correto
async restoreUser({ targetUserId, actorId }: { targetUserId: number; actorId: number })
async audit({ event, actorId, entityId }: AuditParams)

// ✗ evitar
async restoreUser(targetUserId: number, actorId: number)
async audit(event: string, actorId: number, entityId: string)
```

Exceções: funções sem parâmetros e funções que recebem um único objeto já tipado como input de schema Zod (`input: RegisterInput`, `query: AdminUsersQuery`).

## Arquitetura do frontend

Sempre seguir a hierarquia de Atomic Design. **Nunca colocar lógica de negócio directamente numa page.**

```
pages/          → wrapper mínimo: só definePageMeta + useSeoMeta + <TemplatesXxx />
templates/      → layout da página + composição de organisms (sem lógica de API)
organisms/      → lógica de API, estado, usePaginated, toasts — UI complexa e autónoma
molecules/      → combinações de atoms sem estado próprio de API
atoms/          → componentes base sem lógica de negócio
```

### Exemplo correto

```
pages/notificacoes.vue          → <TemplatesNotificacoes /> + definePageMeta + useSeoMeta
templates/notificacoes.vue      → layout + <OrganismsNotificacoes />
organisms/notificacoes/index.vue → usePaginated, chamadas à API, toasts, markup
```

### Regras

- Pages são wrappers — máximo 5 linhas de script
- Templates só fazem layout e composição, sem `$fetch` nem `useApi`
- Organisms são os únicos que chamam `useApi()`, `usePaginated()`, `useToast()`

---

## Padrão de branches

```
tipo/descricao-curta-em-portugues
```

### Exemplos

```
feat/auth-frontend
feat/rbac-permissions
fix/refresh-token-rotativo
chore/atualizar-dependencias
docs/atualizar-roadmap
```

### Regras

- Usar o mesmo **tipo** do commit que será gerado na branch
- Descrição em **português**, com hífens, sem acentos
- Sem números de issue no nome (usar na mensagem do PR)

---

## Padrão de commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/) com **tipo, escopo e descrição sempre em português**.

### Formato

```
tipo(escopo): descrição no imperativo, em português
```

### Tipos permitidos

| Tipo       | Quando usar                              |
| ---------- | ---------------------------------------- |
| `feat`     | Nova funcionalidade                      |
| `fix`      | Correção de bug                          |
| `chore`    | Manutenção, deps, configuração           |
| `refactor` | Refatoração sem mudança de comportamento |
| `docs`     | Documentação                             |
| `test`     | Testes                                   |
| `style`    | Formatação, sem mudança de lógica        |

### Escopos sugeridos

`auth`, `users`, `roles`, `permissions`, `admin`, `db`, `ui`, `api`, `config`, `deps`

### Exemplos

```
feat(auth): adicionar refresh token rotativo
fix(users): corrigir validação de email duplicado
chore(deps): atualizar prisma para 7.9
refactor(auth): extrair lógica de hash para utilitário
feat(roles): implementar middleware de verificação de permissão
docs: atualizar documentação de rotas da API
```

### Regras

- Descrição em **português**, no **imperativo** ("adicionar", não "adicionando" ou "adicionado")
- Sem ponto final na descrição
- Escopo em minúsculas
- Uma mudança por commit — não agrupar features não relacionadas
