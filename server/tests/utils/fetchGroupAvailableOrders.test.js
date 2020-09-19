'use strict';

const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

import { testsRouter } from '../../src/router_new';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(testsRouter.routes());

  server = app.listen(4000, (err) => {
    if (err) return done(err);
    agent = request.agent(server);
    done();
  });

});

afterEach(async done => {
  return server && server.close(done);
});


describe('fetchGroupAvailableOrders', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return list of group\'s available orders', async () => {

    const groupid = '1';

    const response = await agent.get(`/tests/available-orders/${groupid}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(Array.isArray(response.body.payload)).toBeTruthy();

    if (response.body.payload.length) {
      for (let order of response.body.payload) {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('deadline_ts');
        expect(order).toHaveProperty('delivery_ts');
        expect(order).toHaveProperty('delivery_status');
        expect(order).toHaveProperty('confirmed_status');
        expect(order).toHaveProperty('group_id');
      }
    }
  });


});