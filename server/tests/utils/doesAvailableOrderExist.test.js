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


describe('doesAvailableOrderExist', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true if a group already has a matching deadlineTs/deliveryTs availableorder', async () => {

    const firstAvailableOrderResponse = await agent.get('/tests/first-available-order');

    const availableOrder = {
      groupid: firstAvailableOrderResponse.body.payload.group_id,
      deadlineTs: firstAvailableOrderResponse.body.payload.deadline_ts,
      deliveryTs: firstAvailableOrderResponse.body.payload.delivery_ts,
    };

    const response = await agent
      .post('/tests/does-available-order-exist')
      .send(availableOrder);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if a group does not have a matching deadlineTs/deliveryTs availableorder', async () => {

    const newAvailableOrder = {
      groupid: '1',
      deadlineTs: new Date(0),
      deliveryTs: new Date(1000),
    };

    const response = await agent
      .post('/tests/does-available-order-exist')
      .send(newAvailableOrder);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });

});