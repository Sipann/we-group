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


describe('isUserRemovable', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });



  it('should return true if user can be removed from group (has no pending placed orders for this group)', async () => {

    const userid = 'user5';
    const groupid = '3';

    const response = await agent.get(`/tests/is-user-removable/${groupid}/${userid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if user can\'t be removed from group (has pending placed orders for this group)', async () => {

    const userid = 'user5';
    const groupid = '2';

    const response = await agent.get(`/tests/is-user-removable/${groupid}/${userid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });


});