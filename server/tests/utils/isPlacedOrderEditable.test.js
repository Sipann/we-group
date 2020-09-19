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


describe('isPlacedOrderEditable', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true if corresponding available order has not been confirmed && deadline is in the future', async () => {

    const placedOrderId = '3';

    const response = await agent.get(`/tests/is-placed-order-editable/${placedOrderId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if corresponding available order has been confirmed || deadline is in the past', async () => {

    const placedOrderId = '2';

    const response = await agent.get(`/tests/is-placed-order-editable/${placedOrderId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });


});