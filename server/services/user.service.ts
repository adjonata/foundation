import type { CreateUserInput } from '../schemas/user.schema'
import { userRepository } from '../repositories/user.repository'
import { AppError } from '../utils/errors'
import { hashPassword } from '../utils/password'

export const userService = {
  async listUsers() {
    return userRepository.listAll()
  },

  async createUser(input: CreateUserInput) {
    const exists = await userRepository.findByEmail(input.email)
    if (exists) {
      throw new AppError('EMAIL_IN_USE', 'Email ja cadastrado', 409)
    }

    const passwordHash = await hashPassword(input.password)
    return userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    })
  }
}
