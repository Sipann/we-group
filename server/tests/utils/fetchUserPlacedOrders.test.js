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


describe('fetchUserPlacedOrders', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return placed orders by a user', async () => {

    const user1id = 'user1';
    const user4id = 'user4';

    const responseUser1 = await agent.get(`/tests/fetch-user-placed-orders/${user1id}`);
    const responseUser4 = await agent.get(`/tests/fetch-user-placed-orders/${user4id}`);
    expect(responseUser1.statusCode).toEqual(200);
    expect(responseUser1.body.payload).toHaveLength(5);
    expect(responseUser4.body.payload).toHaveLength(7);
    expect(responseUser1.body.payload[0]).toHaveProperty('user_id');
    expect(responseUser1.body.payload[0]).toHaveProperty('group_id');
    expect(responseUser1.body.payload[0]).toHaveProperty('group_name');
    expect(responseUser1.body.payload[0]).toHaveProperty('order_id');
    expect(responseUser1.body.payload[0]).toHaveProperty('order_deadline_ts');
    expect(responseUser1.body.payload[0]).toHaveProperty('order_delivery_ts');
    expect(responseUser1.body.payload[0]).toHaveProperty('order_delivery_status');
    expect(responseUser1.body.payload[0]).toHaveProperty('order_confirmed_status');
    expect(responseUser1.body.payload[0]).toHaveProperty('item_id');
    expect(responseUser1.body.payload[0]).toHaveProperty('item_name');
    expect(responseUser1.body.payload[0]).toHaveProperty('item_price');
    expect(responseUser1.body.payload[0]).toHaveProperty('item_ordered_quantity');
  });

});
