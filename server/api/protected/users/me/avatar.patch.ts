import { readMultipartFormData } from 'h3'
import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { userService } from '../../../../services/user.service'
import { AppError, toHttpError } from '../../../../utils/errors'
import { ok } from '../../../../utils/response'
import { uploadFile } from '../../../../utils/storage'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const parts = await readMultipartFormData(event)

    if (!parts?.length) {
      throw new AppError('INVALID_INPUT', 'Nenhum arquivo enviado', 400)
    }

    const file = parts.find((p) => p.name === 'file')
    if (!file?.data) {
      throw new AppError('INVALID_INPUT', 'Campo "file" não encontrado', 400)
    }

    if (!file.type?.startsWith('image/')) {
      throw new AppError('INVALID_TYPE', 'Apenas imagens são permitidas', 422)
    }

    if (file.data.length > MAX_SIZE) {
      throw new AppError('FILE_TOO_LARGE', 'Arquivo deve ter no máximo 5MB', 422)
    }

    const ext = extname(file.filename ?? '') || `.${file.type.split('/')[1]}`
    const key = `avatars/${auth.userId}/${randomUUID()}${ext}`
    const avatarUrl = await uploadFile({ key, body: file.data, contentType: file.type })

    const user = await userService.updateAvatar({ userId: auth.userId, avatarUrl })
    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
