'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter } from '../../router_new';

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


describe('isUserDataOwner', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return true if current user is user targeted', async () => {

    const targetedUser = {
      id: 'user1',
      name: 'Bibi',
      email: 'bibi@mail.com',
      phone: '2135467',
      preferred_contact_mode: 'phone',
    };

    const response = await agent
      .post(`/tests/is-user-data-owner/${targetedUser.id}`)
      .send(targetedUser);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if current user is not user targeted', async () => {

    const targetedUser = {
      id: 'user1',
      name: 'Bibi',
      email: 'bibi@mail.com',
      phone: '2135467',
      preferred_contact_mode: 'phone',
    };

    const wrongUserId = 'user2';

    const response = await agent
      .post(`/tests/is-user-data-owner/${wrongUserId}`)
      .send(targetedUser);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });





});