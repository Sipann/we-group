'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, ordersRouter } from '../../router_new';
import { isAvailableOrderIdValid } from '../../models/utilsModels/isAvailableOrderIdValid';
import { isUserGroupMember } from '../../models/utilsModels/isUserGroupMember';
import { isUserIdValid } from '../../models/utilsModels/isUserIdValid';
import { getGroupIdOfAvailableOrder } from '../../models/utilsModels/getGroupIdOfAvailableOrder';

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


jest.mock('../../models/utilsModels/isAvailableOrderIdValid', () => ({
  isAvailableOrderIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/isUserGroupMember', () => ({
  isUserGroupMember: jest.fn(),
}));
jest.mock('../../models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/getGroupIdOfAvailableOrder', () => ({
  getGroupIdOfAvailableOrder: jest.fn(),
}));


describe('placeOrder', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should create a new order', async () => {
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '2' }));
    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user5';  // member of Group2
    const availableorderid = '6';    // available order of Group2
    const itemsOrdered = [
      { itemid: '4', orderedQty: 2, availableItemId: '12' },
      { itemid: '5', orderedQty: 4, availableItemId: '13' },
    ];

    // CHECK DB CONTENT BEFORE MODIFICATION - ORDERED
    const availableItemsInitial = [];
    for (let item of itemsOrdered) {
      const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
      availableItemsInitial.push(availableItemDBResponse.body.payload);
    }

    const response = await agent
      .post(`/orders/${availableorderid}`)
      .set('userid', userid)
      .send(itemsOrdered);


    // CHECK RESPONSE
    const availableOrderResponse = await agent.get(`/tests/available-order/${availableorderid}`);

    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toHaveProperty('placed_order_id');
    expect(response.body.payload).toHaveProperty('group_id', '2');
    expect(response.body.payload).toHaveProperty('deadline_ts', availableOrderResponse.body.payload.deadline_ts);
    expect(response.body.payload).toHaveProperty('delivery_ts', availableOrderResponse.body.payload.delivery_ts);
    expect(response.body.payload).toHaveProperty('delivery_status', 'pending');
    expect(response.body.payload.confirmed_status).toBeFalsy();
    expect(response.body.payload.ordered_items).toMatchObject([
      { itemQty: 2, itemName: 'Group2 Item 1', itemDescription: 'Group2 Item1 Description', itemPrice: '5.00' },
      { itemQty: 4, itemName: 'Group2 Item 2', itemDescription: 'Group2 Item2 Description', itemPrice: '7.00' },
    ]);


    // CHECK DB CONTENT - AVAILABLE ITEMS TABLE
    const availableItemsResult = [];
    for (let i = 0; i < itemsOrdered.length; i++) {
      const item = itemsOrdered[i];
      const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
      expect(availableItemDBResponse.statusCode).toEqual(200);
      expect(availableItemDBResponse.body.ok).toBeTruthy();
      expect(availableItemDBResponse.body.payload).toMatchObject({
        id: item.availableItemId,
        item_id: item.itemid,
        initial_qty: availableItemsInitial[i].initial_qty,
        remaining_qty: availableItemsInitial[i].remaining_qty - item.orderedQty,
        available_order_id: availableorderid,
      });
      availableItemsResult.push(availableItemDBResponse.body.payload);
    }


    // CHECK DB CONTENT - ORDERED ITEMS TABLE
    const orderedItemsResult = [];
    for (let i = 0; i < itemsOrdered.length; i++) {
      const item = itemsOrdered[i];
      const orderedItemDBResponse = await agent
        .get(`/tests/ordered-item/${response.body.payload.placed_order_id}/${item.itemid}`);
      expect(orderedItemDBResponse.statusCode).toEqual(200);
      expect(orderedItemDBResponse.body.ok).toBeTruthy();
      expect(orderedItemDBResponse.body.payload).toHaveProperty('quantity', item.orderedQty);
      expect(orderedItemDBResponse.body.payload).toHaveProperty('item_id', item.itemid);
      expect(orderedItemDBResponse.body.payload).toHaveProperty('placed_order_id', response.body.payload.placed_order_id);
      expect(orderedItemDBResponse.body.payload).toHaveProperty('available_item_id', item.availableItemId);
      expect(orderedItemDBResponse.body.payload).toHaveProperty('available_order_id', availableorderid);
      orderedItemsResult.push(orderedItemDBResponse.body.payload);
    }


    // CHECK DB CONTENT - PLACED ORDER TABLE
    const placedOrderDBResponse = await agent.get(`/tests/placed-orders/${response.body.payload.placed_order_id}`);
    expect(placedOrderDBResponse.statusCode).toEqual(200);
    expect(placedOrderDBResponse.body.ok).toBeTruthy();
    expect(placedOrderDBResponse.body.payload).toMatchObject({
      id: response.body.payload.placed_order_id,
      group_id: response.body.payload.group_id,
      user_id: userid,
      available_order_id: availableorderid,
    });


    // CLEAN UP - REVERT ACTION AVAILABLE ITEMS TABLE
    for (let item of availableItemsInitial) {
      await agent.put(`/tests/available-item/${item.id}/${item.remaining_qty}`);
    }
    // CLEAN UP - REVERT ACTION ORDERED ITEMS TABLE
    for (let orderedItem of orderedItemsResult) {
      await agent.delete(`/tests/ordered-item/${orderedItem.id}`);
    }
    // CLEAN UP - PLACED ORDERS TABLE
    await agent.delete(`/tests/placed-orders/${response.body.payload.placed_order_id}`);

  });


  //? TO UNCOMMENT BELOW - CHECKED
  it('should not create new order if current user is not group member', async () => {
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '2' }));
    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user1';  // valid id but not a member of Group2
    const availableorderid = '6';    // available order of Group2
    const itemsOrdered = [
      { itemid: '4', orderedQty: 2, availableItemId: '12' },
      { itemid: '5', orderedQty: 4, availableItemId: '13' },
    ];

    const response = await agent
      .post(`/orders/${availableorderid}`)
      .set('userid', userid)
      .send(itemsOrdered);

    expect(response.statusCode).toEqual(401);

  });


  it('should not create new order if userid not valid', async () => {
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'wronguserid';
    const availableorderid = '6';    // available order of Group 2
    const itemsOrdered = [
      { itemid: '4', orderedQty: 2, availableItemId: '12' },
      { itemid: '5', orderedQty: 4, availableItemId: '13' },
    ];

    const response = await agent
      .post(`/orders/${availableorderid}`)
      .set('userid', userid)
      .send(itemsOrdered);

    expect(response.statusCode).toEqual(401);

  });


  it('should not create new order if availableorderid not valid', async () => {
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user5';   // member of Group 2
    const availableorderid = '0';
    const itemsOrdered = [
      { itemid: '4', orderedQty: 2, availableItemId: '12' },
      { itemid: '5', orderedQty: 4, availableItemId: '13' },
    ];

    const response = await agent
      .post(`/orders/${availableorderid}`)
      .set('userid', userid)
      .send(itemsOrdered);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create new order if itemsOrdered is empty/missing', async () => {

    const userid = 'user5';   // member of Group 2
    const availableorderid = '6';    // available order of Group 2
    const itemsOrdered = [];

    const response = await agent
      .post(`/orders/${availableorderid}`)
      .set('userid', userid)
      .send(itemsOrdered);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create new order if current userid is missing', async () => {
    const availableorderid = '6';    // available order of Group 2
    const itemsOrdered = [
      { itemid: '4', orderedQty: 2, availableItemId: '12' },
      { itemid: '5', orderedQty: 4, availableItemId: '13' },
    ];

    const response = await agent
      .post(`/orders/${availableorderid}`)
      .send(itemsOrdered);

    expect(response.statusCode).toEqual(401);

  });

});