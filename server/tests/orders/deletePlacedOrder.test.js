'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, ordersRouter } from '../../src/router_new';
import { isUserIdValid } from '../../src/models/utilsModels/isUserIdValid';
import { isPlacedOrderIdValid } from '../../src/models/utilsModels/isPlacedOrderIdValid';
import { doesUserOwnPlacedOrder } from '../../src/models/utilsModels/doesUserOwnPlacedOrder';
import { isPlacedOrderEditable } from '../../src/models/utilsModels/isPlacedOrderEditable';
import { fetchPlacedOrderItems } from '../../src/models/utilsModels/fetchPlacedOrderItems';

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


jest.mock('../../src/models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/isPlacedOrderIdValid', () => ({
  isPlacedOrderIdValid: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/doesUserOwnPlacedOrder', () => ({
  doesUserOwnPlacedOrder: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/isPlacedOrderEditable', () => ({
  isPlacedOrderEditable: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/fetchPlacedOrderItems', () => ({
  fetchPlacedOrderItems: jest.fn(),
}));



describe('deletePlacedOrder', () => {

  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  it('should delete a placed order', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    doesUserOwnPlacedOrder.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: true }));
    fetchPlacedOrderItems.mockImplementation(() => (
      {
        ok: true,
        payload: [
          { quantity: 2, item_id: '4', available_item_id: '12' },
          { quantity: 4, item_id: '5', available_item_id: '13' },
        ]
      }));

    const userid = 'user8';
    const availableOrderId = '6';
    const itemsOrdered = [
      { itemid: '4', orderedQty: 2, availableItemId: '12' },
      { itemid: '5', orderedQty: 4, availableItemId: '13' },
    ];

    // CHECK DB CONTENT BEFORE MODIFICATION - AVAILABLE ITEMS TABLE
    const availableItemsInitial = [];
    for (let i = 0; i < itemsOrdered.length; i++) {
      const item = itemsOrdered[i];
      const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
      availableItemsInitial.push(availableItemDBResponse.body.payload);
    }

    // console.log('TESTS availableItemsInitial =>', availableItemsInitial);
    // availableItemsInitial => [
    //   {
    //     id: '12',
    //     item_id: '4',
    //     initial_qty: 10,
    //     remaining_qty: 2,
    //     available_order_id: '6'
    //   },
    //   {
    //     id: '13',
    //     item_id: '5',
    //     initial_qty: 10,
    //     remaining_qty: 6,
    //     available_order_id: '6'
    //   }
    // ]


    // CREATE PLACED ORDER TO BE DELETED NEXT
    const placedOrder = await agent
      .post(`/orders/${availableOrderId}`)
      .set('userid', userid)
      .send(itemsOrdered);

    const placedOrderId = placedOrder.body.payload.placed_order_id;
    // console.log('TESTS placedOrderId =>', placedOrderId);

    //!

    // DELETE PLACED ORDER
    const response = await agent
      .delete(`/orders/placed/${placedOrderId}`)
      .set('userid', userid);


    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toEqual(placedOrderId);


    // CHECK DB CONTENT AVAILABLE ITEMS TABLE
    for (let i = 0; i < availableItemsInitial.length; i++) {
      const item = availableItemsInitial[i];
      const availableItemDBResponse = await agent.get(`/tests/available-item/${item.id}`);
      expect(availableItemDBResponse.statusCode).toEqual(200);
      expect(availableItemDBResponse.body.ok).toBeTruthy();
      expect(availableItemDBResponse.body.payload).toMatchObject(item);
    }


    // CHECK DB CONTENT - ORDERED ITEMS TABLE
    for (let i = 0; i < itemsOrdered.length; i++) {
      const item = itemsOrdered[i];
      const orderedItemDBResponse = await agent
        .get(`/tests/ordered-item/${placedOrderId}/${item.itemid}`);
      expect(orderedItemDBResponse.statusCode).toEqual(200);
      expect(orderedItemDBResponse.body.ok).toBeTruthy();
      expect(Array.isArray(orderedItemDBResponse.body.payload)).toBeTruthy();
      expect(orderedItemDBResponse.body.payload.length).toBeFalsy();
    }

    // CHECK DB CONTENT - PLACED ORDER TABLE
    const placedOrderDBResponse = await agent.get(`/tests/placed-orders/${placedOrderId}`);
    expect(placedOrderDBResponse.statusCode).toEqual(200);
    expect(placedOrderDBResponse.body.ok).toBeTruthy();
    expect(Array.isArray(placedOrderDBResponse.body.payload)).toBeTruthy();
    expect(placedOrderDBResponse.body.payload.length).toBeFalsy();

  });



  it('should not delete a placed order if userid is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'wronguserid';
    const placedOrderId = '3';

    const response = await agent
      .delete(`/orders/placed/${placedOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);
  });


  it('should not delete a placed order if placedOrderId is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user8';
    const placedOrderId = 'wrongplacedOrderid';

    const response = await agent
      .delete(`/orders/placed/${placedOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(400);
  });


  it('should not delete a placed order if current user does not own data', async () => {

    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    doesUserOwnPlacedOrder.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user8';
    const placedOrderId = '3';

    const response = await agent
      .delete(`/orders/placed/${placedOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });


  it('should not delete a placed order if current user does not own data', async () => {

    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    doesUserOwnPlacedOrder.mockImplementation(() => ({ ok: true, payload: true }));
    isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user1';
    const placedOrderId = '2';

    const response = await agent
      .delete(`/orders/placed/${placedOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });


});