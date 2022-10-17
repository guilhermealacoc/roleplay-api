import { Response } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import { Assert } from 'japa/build/src/Assert'
import supertest from 'supertest'

import { UserFactory } from './../../database/factories/index'

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

test.group('User', (group) => {
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

    console.log({ body })
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return return 409 when email is already in use', async (assert) => {
    const { username } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        username,
        email: 'tste@teste.com',
        password: 'test',
      })
      .expect(409)

    console.log({ body })
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'username')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test.only('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({}).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
