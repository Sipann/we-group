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


describe('getLightGroupMembers', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return an array of users that are members of a group', async () => {

    const groupid = 3;

    const expected = [
      { id: 'user3', name: 'Baba' },
      { id: 'user4', name: 'Lola' },
      { id: 'user5', name: 'Sisi' },
    ];

    const response = await agent.get(`/tests/get-light-group-members/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(expected);

  });


});