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


describe('isUserIdValid', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });



  it('should return true if userid is valid', async () => {

    const userid = 'user4';

    const response = await agent.get(`/tests/is-user-id-valid/${userid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if userid is not valid', async () => {

    const userid = 'user0';

    const response = await agent.get(`/tests/is-user-id-valid/${userid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });


});