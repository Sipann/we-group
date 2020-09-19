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


describe('isPlacedOrderIdValid', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });



  it('should return true if placedorderid is valid', async () => {

    const placedorderid = '2';

    const response = await agent.get(`/tests/is-placed-order-id-valid/${placedorderid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if placedorderid is not valid', async () => {

    const placedorderid = '0';

    const response = await agent.get(`/tests/is-placed-order-id-valid/${placedorderid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });


});