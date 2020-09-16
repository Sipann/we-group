'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { ordersRouter } from '../../router_new';
import { isPlacedOrderIdValid } from '../../models/utilsModels/isPlacedOrderIdValid';
import { isUserIdValid } from '../../models/utilsModels/isUserIdValid';
import { doesUserOwnPlacedOrder } from '../../models/utilsModels/doesUserOwnPlacedOrder';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(ordersRouter.routes());

  server = app.listen(4000, (err) => {
    if (err) return done(err);
    agent = _agent(server);
    done();
  });

});

afterEach(async done => {
  return server && server.close(done);
});


jest.mock('../../models/utilsModels/isPlacedOrderIdValid', () => ({
  isPlacedOrderIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/doesUserOwnPlacedOrder', () => ({
  doesUserOwnPlacedOrder: jest.fn(),
}));



describe('fetchPlacedOrder', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return full info about a placed order', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    doesUserOwnPlacedOrder.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user1';
    const placedorderid = '1';

    const expected = {
      placed_order_id: '1',
      group_id: '1',
      deadline_ts: '2020-06-03T20:25:34.440Z',
      delivery_ts: '2020-06-05T20:25:34.440Z',
      delivery_status: 'done',
      confirmed_status: true,
      ordered_items: [
        { itemQty: 6, itemName: 'Group1 Item 1', itemDescription: 'Group1 Item1 Description', itemPrice: '10.00' },
        { itemQty: 10, itemName: 'Group1 Item 2', itemDescription: 'Group1 Item2 Description', itemPrice: '15.00' },
      ]
    };

    const response = await agent
      .get(`/orders/placed/${placedorderid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(expected);
  });


  it('should not return info if userid is missing', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));
    const placedorderid = '1';

    const response = await agent
      .get(`/orders/placed/${placedorderid}`);

    expect(response.statusCode).toEqual(401);
  });


  it('should not return info if userid is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'wronguserid';
    const placedorderid = '1';

    const response = await agent
      .get(`/orders/placed/${placedorderid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);
  });


  it('should not return info if placedorderid is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: false }));
    const userid = 'user1';
    const placedorderid = '0';

    const response = await agent
      .get(`/orders/placed/${placedorderid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(400);
  });


  it('should not return info if current user is not data owner', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    doesUserOwnPlacedOrder.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user1';
    const placedorderid = '1';

    const response = await agent
      .get(`/orders/placed/${placedorderid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);
  });

});