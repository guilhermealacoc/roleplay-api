import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['email', 'username', 'password', 'avatar'])

    if (!userPayload.email || !userPayload.username || !userPayload.password)
      throw new BadRequest('provide required data', 422)

    const userByEmail = await User.findBy('email', userPayload.email)
    const userByUsername = await User.findBy('username', userPayload.username)

    if (userByEmail) throw new BadRequest('email alread in use', 409)
    if (userByUsername) throw new BadRequest('username alread in use', 409)

    const user = await User.create(userPayload)
    return response.created({ user })
  }
}
