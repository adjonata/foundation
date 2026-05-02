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
