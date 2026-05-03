# Roadmap — foundation

Cada feature segue o padrão: **back completo → front completo** antes de avançar para a próxima.

Ordem de implementação dentro do back: `schema → migration → repository → service → route`

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
- [x] Página autenticada de teste `app/pages/teste-auth.vue` com middleware `auth` para validar login e exibir dados da sessão
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
- [x] Rotas `GET /api/admin/permissions` e `GET /api/admin/roles`

### Front

- [x] Página `/admin/roles` — listagem de roles com suas permissões
- [x] Componente de badge de role reutilizável

---

## 2. Painel Admin

### Back

- [ ] Rota `GET /api/admin/users` — listagem com paginação e busca
- [ ] Rota `PATCH /api/admin/users/:id/role` — alterar role
- [ ] Rota `GET /api/admin/sessions` — sessões ativas de todos os usuários
- [ ] Rota `DELETE /api/admin/sessions/:id` — revogar sessão
- [ ] Proteção de todas as rotas `/api/admin/*` para `SUPER_ADMIN`

### Front

- [ ] Layout `/admin` com sidebar e navegação
- [ ] Página `/admin/users` — tabela com busca, paginação e ação de alterar role
- [ ] Página `/admin/sessions` — tabela de sessões com ação de revogar
- [ ] Guard de rota: redirecionar não-admin para `/`

---

## 3. Refresh Token Rotativo

### Back

- [ ] Ao fazer refresh, revogar sessão antiga e emitir nova (já parcialmente implementado)
- [ ] Detectar reutilização de refresh token expirado → revogar todas as sessões do usuário
- [x] Rota `GET /api/auth/me` — ver §0 (concluído)

### Front

- [ ] Atualizar o interceptor de refresh (item 0) para lidar com reutilização de token detectada pelo back (revogar sessão local e redirecionar para login)
- [ ] Exibir toast de "sessão expirada" quando refresh falha

---

## 4. Verificação de E-mail

### Back

- [ ] Campo `emailVerifiedAt DateTime?` no model `User`
- [ ] Migration
- [ ] Integração de envio de e-mail (ex: Resend ou Nodemailer)
- [ ] Model `EmailVerificationToken` (`userId`, `token`, `expiresAt`)
- [ ] Envio automático de token após cadastro
- [ ] Rota `POST /api/auth/verify-email` — valida token e marca e-mail como verificado
- [ ] Rota `POST /api/auth/resend-verification` — reenvia token
- [ ] Bloqueio de acesso a rotas protegidas sem verificação

### Front

- [ ] Página `/auth/verify-email` — instrução de verificação com botão de reenvio
- [ ] Banner de alerta para usuários com e-mail não verificado
- [ ] Feedback visual após verificação bem-sucedida

---

## 5. Reset de Senha

### Back

- [ ] Model `PasswordResetToken` (`userId`, `tokenHash`, `expiresAt`, `usedAt`)
- [ ] Migration
- [ ] Rota `POST /api/auth/forgot-password` — gera e envia token por e-mail
- [ ] Rota `POST /api/auth/reset-password` — valida token, atualiza senha e invalida token
- [ ] Expiração de token em 1 hora
- [ ] Revogar todas as sessões ativas após reset

### Front

- [ ] Página `/auth/forgot-password` — formulário de e-mail
- [ ] Página `/auth/reset-password?token=...` — formulário de nova senha
- [ ] Feedback de sucesso e redirecionamento para login

---

## 6. Soft Delete

### Back

- [ ] Campo `deletedAt DateTime?` nos models principais (`User`)
- [ ] Migration
- [ ] Helper `softDelete(model, id)` reutilizável
- [ ] Filtro `where: { deletedAt: null }` automático nas queries dos repositories
- [ ] Rota `DELETE /api/admin/users/:id` — soft delete de usuário

### Front

- [ ] Ação de desativar usuário na página `/admin/users`
- [ ] Filtro de mostrar/ocultar usuários desativados
- [ ] Indicador visual de usuário desativado na tabela

---

## 7. Audit Log

### Back

- [ ] Model `AuditLog` (`userId`, `action`, `entity`, `entityId`, `metadata JSON`, `createdAt`)
- [ ] Migration
- [ ] Helper `audit(event, action, entity, entityId, metadata?)` em `server/utils/`
- [ ] Log automático nas ações críticas: login, logout, alteração de role, deleção, reset de senha
- [ ] Rota `GET /api/admin/audit-logs` — listagem com filtros e paginação

### Front

- [ ] Página `/admin/audit-logs` — tabela com filtros por usuário, ação e data
- [ ] Formatação legível de cada tipo de ação

---

## 8. Paginação Genérica

### Back

- [ ] Helper `paginate(model, where, page, perPage, orderBy?)` reutilizável
- [ ] Schema Zod `paginationSchema` para validar `page` e `perPage`
- [ ] Formato padronizado de resposta: `{ data, total, page, perPage, totalPages }`
- [ ] Aplicar em todas as rotas de listagem existentes

### Front

- [ ] Composable `usePagination()` para gerenciar estado de página
- [ ] Componente `AppPagination` reutilizável
- [ ] Aplicar em todas as tabelas existentes no admin

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

## 13. Two-Factor Authentication (2FA)

### Back

- [ ] Dependência `otplib` + `qrcode`
- [ ] Campos `twoFactorSecret String?` e `twoFactorEnabledAt DateTime?` no model `User`
- [ ] Migration
- [ ] Rota `POST /api/auth/2fa/setup` — gera secret e QR code
- [ ] Rota `POST /api/auth/2fa/enable` — valida primeiro código TOTP e habilita
- [ ] Rota `POST /api/auth/2fa/disable` — desabilita (exige senha)
- [ ] Rota `POST /api/auth/2fa/verify` — validar código no fluxo de login
- [ ] Gerar e armazenar 8 códigos de backup no setup
- [ ] Ajuste no fluxo de login: retornar `requiresTwoFactor: true` quando 2FA ativo

### Front

- [ ] Página `/settings/security` — seção de 2FA com QR code e campo de confirmação
- [ ] Página `/auth/2fa` — tela intermediária no login para inserir código TOTP
- [ ] Exibição dos códigos de backup após habilitar (com aviso para salvar)

---

## 14. Internacionalização (i18n)

### Back

- [ ] Mensagens de erro em pt-BR e en-US via objeto de tradução em `server/utils/errors`

### Front

- [ ] Configuração do módulo `@nuxtjs/i18n`
- [ ] Arquivos de tradução `locales/pt-BR.json` e `locales/en-US.json`
- [ ] Todas as strings de UI extraídas para os arquivos de tradução
- [ ] Seletor de idioma no header
