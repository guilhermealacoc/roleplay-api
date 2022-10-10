import { UserFactory } from './../../database/factories/index'
import test from 'japa'
import { Assert } from 'japa/build/src/Assert'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

/*
{
  "users":{
    "id": number,
    "email": string,
    "username": string,
    "password": string,
    "avatar": string
  }
}
*/

test.group('User', () => {
  test('it should create an user', async (assert) => {
    const userPayload = {
      email: 'teste@test.com',
      username: 'Teste',
      password: 'test',
      avatar: 'http://images.com/images',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)

    assert.exists(body.user, 'User Undefined')
    assert.exists(body.user.id, 'id Undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.notExists(body.user.password, 'Password find')
    assert.equal(body.user.avatar, userPayload.avatar)
  })

  test('it should return return 409 when email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'teste',
        password: 'test',
      })
      .expect(409)
  })
})
