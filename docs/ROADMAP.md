# Roadmap — foundation

Cada feature segue o padrão: **back completo → front completo** antes de avançar para a próxima.

Ordem de implementação dentro do back: `schema → migration → repository → service → route`

---

## Prioridade Atual (próximas etapas)

Com base no estado atual do projeto, priorizar nesta ordem:

1. Configurações do Usuário (§10) — edição de nome/e-mail e gestão de sessões próprias
2. Rate Limiting (§12)
3. Login com Google (§13)

Também adicionar em paralelo:

- Testes automatizados (unit/integration/e2e)
- Observabilidade (logs estruturados + monitoramento)

---

## 0. Auth — Frontend

Base no servidor já existente: login, register, logout, refresh (`/api/auth/*`), middleware Nitro de contexto (`server/middleware/01.auth.ts`), cookies HttpOnly.

### Back (API) — concluído

- [x] Rota `GET /api/auth/me` — utilizador autenticado via access token em cookie (`server/api/auth/me.get.ts`, `authService.getMe`)
- [x] Cabeçalhos de cache reutilizáveis (`server/utils/cacheHeaders.ts`): `setPrivateNoStoreHeaders`, `setNoStoreHeaders`, `setPublicCacheHeaders`, `setVaryHeaders`, etc.
- [x] Middleware global `server/middleware/00.api-cache.ts` — aplica `private, no-store` a todas as rotas `/api/*` sem editar cada handler; prefixos em `API_CACHE_OPT_OUT_PREFIXES` para rotas públicas cacheáveis (definir nesses handlers `setPublicCacheHeaders` / SWR, etc.)

### Front — concluído

Rotas de autenticação na app: **`/entrar`** (login) e **`/cadastrar`** (registo). Redirecionamento de URLs antigas: `/auth/login` → `/entrar`, `/auth/register` → `/cadastrar` (`nuxt.config` `routeRules`).

- [x] Pinia store `useAuthStore` — `user`, `isAuthenticated`, `role` (`app/stores/auth.ts`)
- [x] Ações: `login()`, `register()`, `logout()`, `fetchMe()`, `ensureSession()`; `$fetch` com `credentials: 'include'` e reencaminhamento de cookie no SSR
- [x] Helper `getFetchErrorMessage` em `app/utils/fetchError.ts` (toasts nas páginas)
- [x] Composable `useApi` com módulos por seção da API (inicial: `auth`) e tratamento de erro padrão em camada única
- [x] Interceptor automático de refresh: ao receber `401`, chamar `/api/auth/refresh` e repetir a requisição
- [x] Páginas `app/pages/entrar.vue` e `app/pages/cadastrar.vue` integradas com a store, redirect pós-sucesso e query `redirect` segura
- [x] Route middleware `auth.ts` — redirecionar para `/entrar` se não autenticado
- [x] Route middleware `guest.ts` — redirecionar para `/` se já autenticado
- [x] Botão de logout no header com `authStore.logout()`
- [x] `runtimeConfig.public.appName` + `useSeoMeta` em `entrar` / `cadastrar` e `app.vue`

---

## 1. RBAC — Roles & Permissions

### Back

- [x] Model `Permission` (`name`, `description`)
- [x] Relação `Role ↔ Permission` (many-to-many via `RolePermission`)
- [x] Migration
- [x] `permission.repository.ts` — listar permissões por role
- [x] Helper `hasPermission(role, permission)` em `server/utils/`
- [x] Middleware de verificação de permissão por rota
- [x] Seed com permissões padrão por role
- [x] Rotas `GET /api/protected/admin/permissions` e `GET /api/protected/admin/roles`

### Front

- [x] Página `/admin/roles` — listagem de roles com suas permissões
- [x] Componente de badge de role reutilizável

---

## 2. Painel Admin

### Back

- [x] Rota `GET /api/protected/admin/users` — listagem com paginação e busca
- [x] Rota `PATCH /api/protected/admin/users/:id/role` — alterar role
- [x] Rota `GET /api/protected/admin/sessions` — sessões ativas de todos os usuários
- [x] Rota `DELETE /api/protected/admin/sessions/:id` — revogar sessão
- [x] Proteção de todas as rotas `/api/protected/admin/*` para `SUPER_ADMIN`

### Front

- [x] Layout `/admin` com sidebar e navegação
- [x] Página `/admin/users` — tabela com busca, paginação e ação de alterar role
- [x] Página `/admin/sessions` — tabela de sessões com ação de revogar
- [x] Guard de rota: redirecionar quem não for `SUPER_ADMIN` para `/`

---

## 3. Refresh Token Rotativo

### Back

- [x] Ao fazer refresh, revogar sessão antiga e emitir nova
- [x] Detectar reutilização de refresh token expirado → revogar todas as sessões do usuário
- [x] Rota `GET /api/auth/me` — ver §0 (concluído)

### Front

- [x] Atualizar o interceptor de refresh (item 0) para lidar com reutilização de token detectada pelo back (revogar sessão local e redirecionar para login)
- [x] Exibir toast de "sessão expirada" quando refresh falha

---

## 4. Verificação de E-mail

### Back

- [x] Campo `emailVerifiedAt DateTime?` no model `User`
- [x] Migration
- [x] Integração de envio de e-mail (Resend)
- [x] Model `EmailVerificationToken` (`userId`, `tokenHash`, `expiresAt`, `usedAt`)
- [x] Envio automático de token após cadastro
- [x] Rota `POST /api/auth/verify-email` — valida token e marca e-mail como verificado
- [x] Rota `POST /api/auth/resend-verification` — reenvia token
- [x] Bloqueio de acesso a rotas protegidas sem verificação

### Back (admin)

- [x] Rota `POST /api/protected/admin/users/:id/resend-verification` — admin reenvia e-mail de verificação para um utilizador específico (requer `SUPER_ADMIN`)

### Front

- [x] Página `/verificar-email` — instrução de verificação com botão de reenvio
- [x] Banner persistente no topo para utilizadores autenticados com e-mail não verificado, com link para `/verificar-email`
- [x] Feedback visual após verificação bem-sucedida (toast + redirect automático)
- [x] Coluna `Verificado` na tabela `/admin/users` — badge verde/cinza com base em `emailVerifiedAt`
- [x] Ação "Reenviar verificação" por linha em `/admin/users` — visível apenas para utilizadores não verificados

---

## 5. Reset de Senha

### Back

- [x] Model `PasswordResetToken` (`userId`, `tokenHash`, `expiresAt`, `usedAt`)
- [x] Migration
- [x] Rota `POST /api/auth/forgot-password` — gera e envia token por e-mail
- [x] Rota `POST /api/auth/reset-password` — valida token, atualiza senha e invalida token
- [x] Expiração de token em 1 hora
- [x] Revogar todas as sessões ativas após reset

### Front

- [x] Página `/esqueci-senha` — formulário de e-mail
- [x] Página `/redefinir-senha?token=...` — formulário de nova senha
- [x] Feedback de sucesso e redirecionamento para login

---

## 6. Soft Delete

### Back

- [x] Campo `deletedAt DateTime?` no model `User`
- [x] Migration
- [x] `findByEmail` e `findById` filtram utilizadores desativados (bloqueia login e acesso a rotas protegidas)
- [x] `login()` rejeita credenciais de utilizadores desativados com `INVALID_CREDENTIALS`
- [x] Rota `DELETE /api/protected/admin/users/:id` — desativa utilizador e revoga sessões (requer `ADMIN_USERS_DELETE`)
- [x] Rota `PATCH /api/protected/admin/users/:id/restore` — reativa utilizador desativado (requer `ADMIN_USERS_RESTORE`)
- [x] Proteção do último `SUPER_ADMIN` ativo tanto no soft delete como na alteração de papel

### Front

- [x] Ação "Desativar conta" por linha em `/admin/users` (oculta para utilizadores já desativados)
- [x] Ação "Reativar conta" por linha em `/admin/users` (visível apenas para utilizadores desativados)
- [x] Toggle "Mostrar desativados" no cabeçalho da tabela (reset para página 1 ao alternar)
- [x] Coluna "Estado" com badge Ativo/Desativado

---

## 7. Audit Log

### Back

- [x] Model `AuditLog` (`actorId`, `action`, `entity`, `entityId`, `metadata JSON`, `createdAt`)
- [x] Migration
- [x] Helper `audit({ event, actorId, entityId?, metadata? })` em `server/utils/` com catálogo tipado de eventos em `server/utils/auditEvents.ts`
- [x] 12 eventos auditados: `LOGIN`, `LOGOUT`, `REGISTERED`, `EMAIL_VERIFIED`, `VERIFICATION_RESENT`, `PASSWORD_RESET_REQUESTED`, `PASSWORD_RESET`, `ROLE_CHANGED`, `DELETED`, `RESTORED`, `SESSION_REVOKED`, `TOKEN_REUSE_DETECTED`
- [x] Rota `GET /api/protected/admin/audit-logs` — listagem com filtros por ação, entidade, intervalo de datas e paginação

### Front

- [x] Página `/admin/audit-logs` — tabela com filtros por ação, entidade e intervalo de datas
- [x] Coluna de detalhes com metadados formatados (ex: `from: USER → to: ADMIN`)

---

## 8. Paginação Genérica

### Back

- [x] Schema Zod de paginação (`shared/schemas/pagination.ts`) para validar `page` e `pageSize`
- [x] Helpers reutilizáveis de paginação (`shared/utils/pagination.ts`)
- [x] Formato padronizado de resposta paginada via `PaginatedResult` (`items` + `meta`)
- [ ] Helper `paginate(model, where, page, perPage, orderBy?)` totalmente genérico por model/repository
- [ ] Aplicar em todas as rotas de listagem existentes

### Front

- [x] Composable genérico `usePaginated()` para estado, execução, loading/erro e debounce de busca
- [x] Componente de tabela reutilizável `AtomsTable` com busca, paginação, loading/empty e ações por linha
- [x] Aplicado nas tabelas do admin implementadas (`/admin`, `/admin/users`, `/admin/sessions`)

---

## 9. Upload de Arquivos

### Back

- [x] Integração com storage: local para dev (MinIO), S3-compatible para produção (Cloudflare R2)
- [x] Campo `avatarUrl String?` no model `User`
- [x] Migration
- [x] Rota `PATCH /api/protected/users/me/avatar` — recebe multipart, faz upload no S3, deleta avatar anterior e atualiza o banco numa única chamada

### Front

- [x] Atom `UserAvatar` — avatar com fallback de iniciais
- [x] Molecule `AvatarDropzone` — zona drag-and-drop + preview (sem API, emite v-model:file)
- [x] Organism `usuario/AvatarEditor` — dropzone + chamadas de API + atualiza store
- [x] Organism `usuario/ProfileCard` — card com avatar, nome, e-mail e role
- [x] Página `/usuario` — visualização do perfil
- [x] Página `/usuario/avatar` — edição do avatar

---

## 10. Configurações do Usuário

### Back

- [x] Rota `GET /api/protected/users/me` — perfil completo do utilizador autenticado
- [x] Rota `PATCH /api/protected/users/me` — atualizar nome e e-mail (notifica e-mail antigo + reenvia verificação se e-mail mudar)
- [x] Rota `PATCH /api/protected/users/me/password` — alterar senha (valida senha atual, revoga outras sessões, envia e-mail de segurança)
- [x] Rota `GET /api/protected/users/me/sessions` — listar sessões ativas do próprio utilizador
- [x] Rota `DELETE /api/protected/users/me/sessions/:id` — revogar sessão própria

### Front

- [x] Hero de perfil em `/usuario` — avatar grande com overlay de edição, nome, e-mail, role e badge de verificação
- [x] Formulário de edição de nome e e-mail em `/usuario` com feedback de verificação pendente
- [x] Página `/usuario/seguranca` — alterar senha (redireciona para login após sucesso) + listar/revogar sessões
- [x] Feedback de sucesso/erro em cada ação

---

## 11. Notificações In-App

### Back

- [x] Model `Notification` (`userId`, `type`, `title`, `body`, `readAt`, `createdAt`)
- [x] Migration
- [x] Rota `GET /api/protected/notifications` — listagem das não lidas
- [x] Rota `PATCH /api/protected/notifications/:id/read` — marcar como lida
- [x] Rota `PATCH /api/protected/notifications/read-all` — marcar todas como lidas
- [x] Helper `notify(userId, type, title, body)` em `server/utils/`

### Front

- [x] Componente `NotificationBell` no header com badge de contagem
- [x] Dropdown com lista das últimas notificações
- [x] Página `/notificacoes` — histórico completo
- [x] Polling automático a cada 60s para novas notificações

---

## 12. Rate Limiting

### Back

- [x] Middleware de rate limit nas rotas sensíveis: login, register, forgot-password, reset-password (`server/middleware/03.rate-limit.ts`), contagem por rota+IP persistida no Postgres (model `RateLimitAttempt`, `server/repositories/rate-limit.repository.ts`)
- [x] Limites por IP: 10 tentativas por 15 minutos nas rotas de auth (`AUTH_RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_WINDOW` em `server/utils/rateLimit.ts`)
- [x] Resposta `429 Too Many Requests` com header `Retry-After` e `data: { code: 'RATE_LIMITED', retryAfter }`

### Front

- [x] Tratamento do erro 429 no interceptor de fetch — `useApiBase` (`app/composables/api/base.ts`) normaliza `error.data.retryAfter`
- [x] Mensagem de feedback amigável ao usuário bloqueado — `getFetchErrorMessage` (`app/utils/fetchError.ts`) formata o tempo de espera; exibida via toast nas páginas de login/cadastro/esqueci-senha/redefinir-senha já existentes

---

## 13. Login com Google (OAuth)

### Back

- [ ] Dependência `arctic` (OAuth 2.0 client leve, sem magic)
- [ ] Campos `googleId String? @unique` e `avatarUrl String?` no model `User`
- [ ] Migration
- [ ] Rota `GET /api/auth/google` — redireciona para o consentimento Google com `state` e `code_verifier` (PKCE)
- [ ] Rota `GET /api/auth/google/callback` — troca código por tokens, upsert do utilizador e emite sessão
- [ ] Utilizadores OAuth sem senha não podem usar login por credenciais nem reset de senha

### Front

- [ ] Botão "Continuar com Google" nas páginas `/entrar` e `/cadastrar`
- [ ] Redirecionamento transparente pós-callback (respeitando query `redirect`)
