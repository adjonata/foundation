# Roadmap — foundation

Cada feature segue o padrão: **back completo → front completo** antes de avançar para a próxima.

Ordem de implementação dentro do back: `schema → migration → repository → service → route`

---

## Prioridade Atual (próximas etapas)

Com base no estado atual do projeto, priorizar nesta ordem:

1. Verificação de e-mail
2. Reset de senha
3. Audit log
4. Rate limiting

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

- [ ] Model `AuditLog` (`userId`, `action`, `entity`, `entityId`, `metadata JSON`, `createdAt`)
- [ ] Migration
- [ ] Helper `audit(event, action, entity, entityId, metadata?)` em `server/utils/`
- [ ] Log automático nas ações críticas: login, logout, alteração de role, deleção, reset de senha
- [ ] Rota `GET /api/protected/admin/audit-logs` — listagem com filtros e paginação

### Front

- [ ] Página `/admin/audit-logs` — tabela com filtros por usuário, ação e data
- [ ] Formatação legível de cada tipo de ação

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

- [ ] Integração com storage: local para dev, S3-compatible para produção
- [ ] Rota `POST /api/upload` com validação de tipo (image/\*) e tamanho (máx 5MB)
- [ ] Campo `avatarUrl String?` no model `User`
- [ ] Migration
- [ ] Rota `PATCH /api/users/me/avatar` — atualizar avatar

### Front

- [ ] Componente `AvatarUpload` com preview e drag-and-drop
- [ ] Página `/settings/profile` — formulário de dados pessoais + avatar

---

## 10. Notificações In-App

### Back

- [ ] Model `Notification` (`userId`, `type`, `title`, `body`, `readAt`, `createdAt`)
- [ ] Migration
- [ ] Rota `GET /api/notifications` — listagem das não lidas
- [ ] Rota `PATCH /api/notifications/:id/read` — marcar como lida
- [ ] Rota `PATCH /api/notifications/read-all` — marcar todas como lidas
- [ ] Helper `notify(userId, type, title, body)` em `server/utils/`

### Front

- [ ] Componente `NotificationBell` no header com badge de contagem
- [ ] Dropdown com lista das últimas notificações
- [ ] Página `/notifications` — histórico completo
- [ ] Polling automático a cada 30s para novas notificações

---

## 11. Configurações do Usuário

### Back

- [ ] Rota `GET /api/users/me` — perfil completo do usuário autenticado
- [ ] Rota `PATCH /api/users/me` — atualizar nome e e-mail
- [ ] Rota `PATCH /api/users/me/password` — alterar senha (valida senha atual)
- [ ] Rota `GET /api/users/me/sessions` — listar sessões ativas do próprio usuário
- [ ] Rota `DELETE /api/users/me/sessions/:id` — revogar sessão própria

### Front

- [ ] Página `/settings/profile` — editar nome e avatar
- [ ] Página `/settings/security` — alterar senha e gerenciar sessões ativas
- [ ] Feedback de sucesso/erro em cada ação

---

## 12. Rate Limiting

### Back

- [ ] Middleware de rate limit nas rotas sensíveis: login, register, forgot-password, reset-password
- [ ] Limites por IP: 10 tentativas por 15 minutos nas rotas de auth
- [ ] Resposta `429 Too Many Requests` com header `Retry-After`

### Front

- [ ] Tratamento do erro 429 no interceptor de fetch
- [ ] Mensagem de feedback amigável ao usuário bloqueado

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
