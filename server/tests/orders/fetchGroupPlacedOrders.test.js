'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, ordersRouter } from '../../src/router_new';
import { isAvailableOrderIdValid } from '../../src/models/utilsModels/isAvailableOrderIdValid';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';
import { isUserIdValid } from '../../src/models/utilsModels/isUserIdValid';
import { getGroupIdOfAvailableOrder } from '../../src/models/utilsModels/getGroupIdOfAvailableOrder';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(ordersRouter.routes());
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


jest.mock('../../src/models/utilsModels/isAvailableOrderIdValid', () => ({
  isAvailableOrderIdValid: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/isUserGroupManager', () => ({
  isUserGroupManager: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/getGroupIdOfAvailableOrder', () => ({
  getGroupIdOfAvailableOrder: jest.fn(),
}));


describe('placeOrder', () => {

  it('should return true', () => {
    expect(true).toBeTruthy();
  });

  it('should return group placed orders for a given available order', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '2' }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));

    const availableOrderId = '6';
    const userid = 'user2';

    const response = await agent
      .get(`/orders/placed/all/${availableOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toHaveProperty('available_order_id', availableOrderId);
    expect(response.body.payload).toHaveProperty('deadline_ts');
    expect(response.body.payload).toHaveProperty('delivery_ts');
    expect(response.body.payload).toHaveProperty('delivery_status');
    expect(response.body.payload).toHaveProperty('confirmed_status');
    expect(response.body.payload).toHaveProperty('orders');
    expect(Array.isArray(response.body.payload.orders)).toBeTruthy();
    expect(response.body.payload.orders.length).toEqual(5);
  });


  //! uncomment below - checked
  it('should not return group placed orders if current user is not group manager', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '2' }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const availableOrderId = '5';
    const userid = 'user4';

    const response = await agent
      .get(`/orders/placed/all/${availableOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });


  it('should not return group placed orders if available order id is invalid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const availableOrderId = '0';
    const userid = 'user2';
    const response = await agent
      .get(`/orders/placed/all/${availableOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(400);

  });


  it('should not return group placed orders if user id is invalid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const availableOrderId = '5';
    const userid = 'wronguserid';
    const response = await agent
      .get(`/orders/placed/all/${availableOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });

});