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


describe('isUserDeletable', () => {

  // smoke test
  it('should return true', () => {
    expect(true).toBeTruthy();
  });



  it('should return true if user can be "deleted" (has no pending placed orders)', async () => {

    //! To update when mocked data updated with user with no pending placed orders
    // const userid = '??';

    // const response = await agent.get(`/tests/is-user-id-valid/${userid}`);

    // // CHECK RESPONSE
    // expect(response.statusCode).toEqual(200);
    // expect(response.body.ok).toBeTruthy();
    // expect(response.body.payload).toBeTruthy();

  });


  it('should return false if user can\'t be "deleted" (has pending placed orders)', async () => {

    const userid = 'user5';

    const response = await agent
      .get(`/tests/is-user-deletable`)
      .set('userid', userid);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });


});