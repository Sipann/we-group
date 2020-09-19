'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Mockdate from 'mockdate';

import { test } from '../../src/config';
import { testsRouter } from '../../src/router_new';

let server, agent;

beforeAll(() => {
  Mockdate.set(test.TEST_MOCK_DATE);
});

afterAll(() => {
  Mockdate.reset();
});

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


describe('isGroupDeletable', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true if group has no pending available orders', async () => {
    const groupid = '3';
    const response = await agent.get(`/tests/is-group-deletable/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();
  });


  it('should return true is group has pending available orders', async () => {

    const groupid = '2';

    const response = await agent.get(`/tests/is-group-deletable/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();
  });

});