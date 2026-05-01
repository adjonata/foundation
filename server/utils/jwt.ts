import { jwtVerify, SignJWT } from 'jose'
import { AppError } from './errors'

const ACCESS_TOKEN_TTL = Number(process.env.ACCESS_TOKEN_TTL ?? 60 * 15)
const REFRESH_TOKEN_TTL = Number(process.env.REFRESH_TOKEN_TTL ?? 60 * 60 * 24 * 7)

function getSecret() {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new AppError('MISSING_JWT_SECRET', 'JWT_SECRET nao configurado', 500)
  }

  return new TextEncoder().encode(jwtSecret)
}

export type AuthTokenPayload = {
  sub: string
  role: string
  sessionId: string
  type: 'access' | 'refresh'
}

async function signToken(
  payload: Omit<AuthTokenPayload, 'type'>,
  type: 'access' | 'refresh'
) {
  const expiresIn = type === 'access' ? ACCESS_TOKEN_TTL : REFRESH_TOKEN_TTL

  return new SignJWT({ ...payload, type })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(getSecret())
}

export async function signAccessToken(payload: Omit<AuthTokenPayload, 'type'>) {
  return signToken(payload, 'access')
}

export async function signRefreshToken(payload: Omit<AuthTokenPayload, 'type'>) {
  return signToken(payload, 'refresh')
}

export async function verifyToken(token: string, expectedType: 'access' | 'refresh') {
  try {
    const result = await jwtVerify<AuthTokenPayload>(token, getSecret())
    if (result.payload.type !== expectedType) {
      throw new AppError('INVALID_TOKEN', 'Tipo de token invalido', 401)
    }

    return result.payload
  } catch {
    throw new AppError('INVALID_TOKEN', 'Token invalido ou expirado', 401)
  }
}

export function accessTokenTtl() {
  return ACCESS_TOKEN_TTL
}

export function refreshTokenTtl() {
  return REFRESH_TOKEN_TTL
}
