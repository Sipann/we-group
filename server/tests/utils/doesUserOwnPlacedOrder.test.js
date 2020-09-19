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


describe('doesUserOwnPlacedOrder', () => {

  // smoke test
  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  // it('should return true if a group already has a matching deadlineTs/deliveryTs availableorder', async () => {



  // });


  // it('should return false if a group does not have a matching deadlineTs/deliveryTs availableorder', async () => {



  // });

});