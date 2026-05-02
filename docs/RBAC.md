# RBAC no backend

Este documento descreve como o controle de permissões está implementado no backend, como adicionar novas permissões e como operar isso em produção.

## Visão geral

O RBAC atual tem **duas camadas**:

1. **Camada de autorização em código** (fonte de verdade para bloquear/liberar rota)
   - `server/utils/permissions.ts`
   - `server/utils/hasPermission.ts`
   - `server/middleware/02.rbac.ts`
2. **Camada de catálogo no banco** (fonte de consulta para APIs administrativas)
   - Tabelas `Permission` e `RolePermission`
   - `server/repositories/permission.repository.ts`
   - Rotas `GET /api/admin/permissions` e `GET /api/admin/roles`

## Como a autorização acontece hoje

1. `server/middleware/01.auth.ts` hidrata `event.context.auth` com `userId`, `role` e `sessionId`.
2. `server/middleware/02.rbac.ts` identifica rotas `/api/admin/*`.
3. Para rotas mapeadas em `ROUTE_PERMISSIONS`, o middleware:
   - resolve a permissão exigida
   - chama `hasPermission(role, permission)`
   - retorna `403` se o papel não possuir acesso

Importante: hoje o `hasPermission` usa o mapa `ROLE_PERMISSIONS` em código (não consulta banco em tempo real).

## Preciso adicionar permissões no código?

**Sim.** No modelo atual, adicionar permissão exige atualização em código para que ela seja aplicada no acesso.

Checklist para criar uma nova permissão:

1. Adicionar a chave em `PERMISSIONS` (`server/utils/permissions.ts`)
2. Adicionar descrição em `PERMISSION_DEFINITIONS` (`server/utils/permissions.ts`)
3. Vincular papéis em `ROLE_PERMISSIONS` (`server/utils/permissions.ts`)
4. Mapear rota/permissão em `ROUTE_PERMISSIONS` (`server/middleware/02.rbac.ts`) quando necessário
5. (Opcional, mas recomendado) expor essa capacidade em rota/admin UI

## Preciso rodar seed obrigatoriamente?

Depende do objetivo:

- **Para autorização funcionar no middleware:**  
  Não é obrigatório, porque a decisão atual está em código (`hasPermission` + `ROLE_PERMISSIONS`).

- **Para o banco refletir o catálogo de permissões (e APIs admin retornarem dados corretos):**  
  Sim, é necessário rodar seed.

Em resumo:
- sem seed: autorização continua funcionando, mas `Permission`/`RolePermission` podem ficar vazias/desatualizadas
- com seed: banco fica alinhado ao catálogo definido em código

## Fluxo recomendado em desenvolvimento

1. Aplicar migrations
2. Rodar seed (`pnpm prisma:seed`)
3. Testar rotas administrativas

## Como operar em produção

Fluxo recomendado de deploy:

1. `prisma migrate deploy`
2. `prisma db seed` (ou `pnpm prisma:seed`) em job pós-deploy

Observações:

- O seed é idempotente para permissões (usa `upsert` + limpeza/recriação de vínculos `RolePermission`)
- É seguro rodar novamente quando novas permissões forem adicionadas
- Se você não rodar seed após mudança de permissões, o enforcement em código continua, mas o catálogo no banco pode ficar defasado

## Possível evolução (futuro)

Se desejar que o banco seja a fonte de verdade da autorização, o middleware pode passar a consultar permissões persistidas por papel (com cache). Nesse cenário, seed/migração de dados passa a ser obrigatória para enforcement.
