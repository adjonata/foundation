/**
 * Helpers de Cache-Control / Vary para handlers Nitro.
 *
 * Padrao global em todas as rotas `/api/*`: middleware [server/middleware/00.api-cache.ts](../middleware/00.api-cache.ts)
 * (`setPrivateNoStoreHeaders`). Para rotas publicas cacheaveis, inclua o prefixo em `API_CACHE_OPT_OUT_PREFIXES`
 * e defina na rota `setPublicCacheHeaders` / `setStaleWhileRevalidateHeaders`, etc.
 */
import type { H3Event } from "h3";
import { appendResponseHeader, setResponseHeaders } from "h3";

function assertSafeMaxAge(seconds: number, label: string) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error(`${label}: maxAge deve ser um numero >= 0`);
  }
}

/**
 * Cabecalhos legacy para clientes HTTP/1.0 que ignoram apenas Cache-Control.
 */
function setLegacyNoCacheHints(event: H3Event) {
  setResponseHeaders(event, {
    Pragma: "no-cache",
    Expires: "0",
  });
}

/**
 * Resposta que nao deve ser guardada em cache algum (partilhado ou privado).
 * Util para erros ou payloads totalmente dinamicos sem cookie de sessao.
 */
export function setNoStoreHeaders(event: H3Event) {
  setResponseHeaders(event, {
    "Cache-Control": "no-store",
  });
  setLegacyNoCacheHints(event);
}

/**
 * Impede que proxies/CDN/browser guardem respostas personalizadas (sessao, dados do utilizador).
 * Rotas GET que dependem de cookies ou variam por utilizador.
 */
export function setPrivateNoStoreHeaders(event: H3Event) {
  setResponseHeaders(event, {
    "Cache-Control": "private, no-store, must-revalidate",
  });
  setLegacyNoCacheHints(event);
}

/**
 * Pode guardar em cache, mas tem de revalidar antes de usar (ETag/Last-Modified ou novo pedido).
 * Util quando queres permitir armazenamento curto mas sempre negociar frescura.
 */
export function setNoCacheHeaders(event: H3Event) {
  setResponseHeaders(event, {
    "Cache-Control": "no-cache, must-revalidate",
  });
  setLegacyNoCacheHints(event);
}

export type PublicCacheOptions = {
  /** Segundos para max-age (cliente e proxies que respeitem public). */
  maxAge: number;
  /** Opcional: stale-while-revalidate em segundos (RFC 5861). */
  staleWhileRevalidate?: number;
  /** Opcional: s-maxage para CDNs (so intermediarios). */
  sMaxAge?: number;
};

/**
 * Conteudo igual para todos os utilizadores (ex.: lista publica estatica na CDN).
 */
export function setPublicCacheHeaders(
  event: H3Event,
  options: PublicCacheOptions,
) {
  assertSafeMaxAge(options.maxAge, "setPublicCacheHeaders");
  const parts = [`public`, `max-age=${Math.floor(options.maxAge)}`];
  if (options.sMaxAge !== undefined) {
    assertSafeMaxAge(options.sMaxAge, "setPublicCacheHeaders.sMaxAge");
    parts.push(`s-maxage=${Math.floor(options.sMaxAge)}`);
  }
  if (options.staleWhileRevalidate !== undefined) {
    assertSafeMaxAge(
      options.staleWhileRevalidate,
      "setPublicCacheHeaders.staleWhileRevalidate",
    );
    parts.push(
      `stale-while-revalidate=${Math.floor(options.staleWhileRevalidate)}`,
    );
  }
  setResponseHeaders(event, {
    "Cache-Control": parts.join(", "),
  });
}

/**
 * Conteudo especifico do utilizador com TTL curto no browser (nao em CDN partilhada sem Vary).
 */
export function setPrivateCacheHeaders(event: H3Event, maxAgeSeconds: number) {
  assertSafeMaxAge(maxAgeSeconds, "setPrivateCacheHeaders");
  setResponseHeaders(event, {
    "Cache-Control": `private, max-age=${Math.floor(maxAgeSeconds)}`,
  });
}

export type StaleCacheOptions = {
  maxAge: number;
  staleWhileRevalidate: number;
};

/**
 * Lista ou recurso que pode servir ligeiramente desatualizado enquanto revalida em fundo.
 */
export function setStaleWhileRevalidateHeaders(
  event: H3Event,
  options: StaleCacheOptions,
) {
  assertSafeMaxAge(options.maxAge, "setStaleWhileRevalidateHeaders.maxAge");
  assertSafeMaxAge(
    options.staleWhileRevalidate,
    "setStaleWhileRevalidateHeaders.staleWhileRevalidate",
  );
  setResponseHeaders(event, {
    "Cache-Control": `public, max-age=${Math.floor(options.maxAge)}, stale-while-revalidate=${Math.floor(options.staleWhileRevalidate)}`,
  });
}

/**
 * Assets com fingerprint no URL (hash); browser pode assumir que nunca muda no mesmo URL.
 */
export function setImmutablePublicHeaders(
  event: H3Event,
  maxAgeSeconds: number,
) {
  assertSafeMaxAge(maxAgeSeconds, "setImmutablePublicHeaders");
  setResponseHeaders(event, {
    "Cache-Control": `public, max-age=${Math.floor(maxAgeSeconds)}, immutable`,
  });
}

/**
 * Indica que a resposta varia com estes cabecalhos de pedido (ex.: Cookie, Accept-Language).
 * Importante atras de CDN quando a mesma URL pode ter corpos diferentes.
 */
export function setVaryHeaders(event: H3Event, names: string[]) {
  if (names.length === 0) return;
  const value = names
    .map((n) => n.trim())
    .filter(Boolean)
    .join(", ");
  if (!value) return;
  setResponseHeaders(event, {
    Vary: value,
  });
}

/**
 * Combina variacao por Cookie com cabecalhos de cache existentes (chamar depois de set*Cache).
 */
export function appendVaryCookie(event: H3Event) {
  appendResponseHeader(event, "Vary", "Cookie");
}
