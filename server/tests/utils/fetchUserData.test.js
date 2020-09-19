'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter } from '../../src/router_new';


let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
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


describe('fetchUserData', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return user data', async () => {

    const userid = 'user1';

    const expected = {
      ok: true,
      payload: {
        id: 'user1',
        name: 'Bobo',
        email: 'bobo@mail.com',
        phone: null,
        preferred_contact_mode: 'email'
      },
    };

    const response = await agent.get(`/tests/fetch-user-data/${userid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject(expected);

  });

});