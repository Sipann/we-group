'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, userRouter } from '../../src/router_new';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(userRouter.routes());
  app.use(testsRouter.routes());

  server = app.listen(4000, (err) => {
    if (err) return done(err);
    agent = _agent(server);
    done();
  });

});

afterEach(async done => {
  return server && server.close(done);
});

describe('createUser', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should create a new user', async () => {
    const newUser = {
      id: 'user7',
      name: 'User7Name',
      email: 'user7@mail.com',
    };

    const expected = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: null,
      preferred_contact_mode: 'email',
    };

    const response = await agent
      .post('/user')
      .send(newUser);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(expected);
    // expect(response.body).toMatchObject(expected);

    // CHECK DB CONTENT
    const contentDBResponse = await agent.get(`/tests/user/${newUser.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toMatchObject(expected);

    // CLEANUP
    await agent.delete(`/tests/user/${newUser.id}`);
  });


  it('should not create a new user if userid argument is falsy/missing', async () => {
    const newUser = {
      id: '',
      name: 'user7Name',
      email: 'user7Email',
    };

    const response = await agent
      .post('/user')
      .send(newUser);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new user if name argument is falsy/missing', async () => {
    const newUser = {
      id: 'user7',
      name: '',
      email: 'user7Email',
    };

    const response = await agent
      .post('/user')
      .send(newUser);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new user if email argument is falsy/missing', async () => {
    const newUser = {
      id: 'user7',
      name: 'user7Name',
      email: '',
    };

    const response = await agent
      .post('/user')
      .send(newUser);

    expect(response.statusCode).toEqual(400);

  });

});