import type { H3Event } from 'h3'
import { deleteCookie, getCookie, setCookie } from 'h3'
import { accessTokenTtl, refreshTokenTtl } from './jwt'

const ACCESS_COOKIE_NAME = 'access_token'
const REFRESH_COOKIE_NAME = 'refresh_token'

function baseCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // 'lax' (não 'strict') é intencional: permite que o SSR receba os cookies na
    // navegação inicial (top-level GET), necessário para hidratar a sessão sem flash.
    // CSRF está coberto porque todas as mutações usam POST/PATCH/DELETE com JSON,
    // e 'lax' já bloqueia cookies em requisições cross-site que não sejam navegação.
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export function setAuthCookies(event: H3Event, accessToken: string, refreshToken: string) {
  setCookie(event, ACCESS_COOKIE_NAME, accessToken, baseCookieOptions(accessTokenTtl()))
  setCookie(event, REFRESH_COOKIE_NAME, refreshToken, baseCookieOptions(refreshTokenTtl()))
}

export function clearAuthCookies(event: H3Event) {
  deleteCookie(event, ACCESS_COOKIE_NAME, { path: '/' })
  deleteCookie(event, REFRESH_COOKIE_NAME, { path: '/' })
}

export function getAccessTokenFromCookie(event: H3Event) {
  return getCookie(event, ACCESS_COOKIE_NAME)
}

export function getRefreshTokenFromCookie(event: H3Event) {
  return getCookie(event, REFRESH_COOKIE_NAME)
}
