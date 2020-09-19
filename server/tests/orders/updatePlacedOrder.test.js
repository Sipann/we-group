'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, ordersRouter } from '../../src/router_new';
import { isPlacedOrderEditable } from '../../src/models/utilsModels/isPlacedOrderEditable';
import { getPlacedOrderById } from '../../src/models/testsModels/getPlacedOrderById';    //! moved


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


jest.mock('../../src/models/utilsModels/isPlacedOrderEditable', () => ({
  isPlacedOrderEditable: jest.fn(),
}));
jest.mock('../../src/models/testsModels/getPlacedOrderById', () => ({
  getPlacedOrderById: jest.fn(),
}));



describe('updatePlacedOrder', () => {

  // smoke test
  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  // it('should update a Placed Order - updating quantities', async () => {
  //   const mockedPlacedOrder = {
  //     id: '3',
  //     group_id: '1',
  //     user_id: 'user1',
  //     available_order_id: '3',
  //   };
  //   const availableOrder = {
  //     id = '3',
  //     delivery_status: 'pending',
  //     confirmed_status: false,
  //   };
  //   const availableItems = {
  //     '5': { initial_qty: 10, remaining_qty: 8 },
  //     '6': { initial_qty: 15, remaining_qty: 0 },
  //   };
  //   getPlacedOrderById.mockImplementation(() => ({ ok: true, payload: mockedPlacedOrder }));
  //   isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: true }));
  //   const userid = 'user1';
  //   const orderedItems = [
  //     { availableItemId: '5', itemid: '1', initialOrderedQty: '2', changedQty: '2' },
  //     { availableItemId: '6', itemid: '2', initialOrderedQty: '15', changedQty: '-5' },
  //   ];

  //   const response = await agent
  //     .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //     .set('userid', userid)
  //     .send(orderedItems);
  //   console.log('TEST response.body =>', response.body);

  //   // CHECK RESPONSE
  //   expect(response.statusCode).toEqual(201);
  //   expect(response.body.ok).toBeTruthy();
  // expect(response.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  // expect(response.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // expect(response.body.payload).toHaveProperty('delivery_status', availableOrder.delivery_status);
  // expect(response.body.payload).toHaveProperty('confirmed_status', availableOrder.confirmed_status);
  // expect(response.body.payload).toHaveProperty('ordered_items');
  // expect(response.body.payload.ordered_items).toMatchObject([
  //   { itemQty: 4, itemName: 'Group1 Item 1', itemDescription: 'Group1 Item1 Description', itemPrice: '10.00' },
  //   { itemQty: 10, itemName: 'Group1 Item 2', itemDescription: 'Group1 Item2 Description', itemPrice: '15.00' },
  // ]);

  //   // CHECK DB CONTENT
  //   const placedOrderDBResponse = await agent.get(`/tests/placed-orders/${mockedPlacedOrder.id}`);
  //   expect(placedOrderDBResponse.statusCode).toEqual(200);
  //   expect(placedOrderDBResponse.body.ok).toBeTruthy();
  //   expect(placedOrderDBResponse.body.payload).toHaveProperty('id', mockedPlacedOrder.id);
  //   expect(placedOrderDBResponse.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  //   expect(placedOrderDBResponse.body.payload).toHaveProperty('user_id', mockedPlacedOrder.user_id);
  //   expect(placedOrderDBResponse.body.payload).toHaveProperty('available_order_id', mockedPlacedOrder.available_order_id);

  //   for (let item of mockedPlacedOrder.orderedItems) {
  //     const orderedItemDBResponse = await agent.get(`/tests/ordered-item/${mockedPlacedOrder.id}/${item.itemid}`);
  //     expect(orderedItemDBResponse.statusCode).toEqual(200);
  //     expect(orderedItemDBResponse.body.ok).toBeTruthy();
  //     expect(orderedItemDBResponse.body.payload).toHaveProperty('item_id', item.itemid);
  //     expect(orderedItemDBResponse.body.payload).toHaveProperty('quantity', (item.initialOrderedQty + item.changedQty));
  //     expect(orderedItemDBResponse.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  //     expect(orderedItemDBResponse.body.payload).toHaveProperty('available_item_id', item.availableItemId);
  //     expect(orderedItemDBResponse.body.payload).toHaveProperty('available_order_id', availableOrder.id);


  //     const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
  //     expect(availableItemDBResponse.statusCode).toEqual(200);
  //     expect(availableItemDBResponse.body.ok).toBeTruthy();
  //     expect(availableItemDBResponse.body.payload).toMatchObject({
  //       id: item.availableItemId,
  //       item_id: item.itemid,
  //       initial_qty: availableItems[item.availableItemId].initial_qty,
  //       remaining_qty: (availableItems[item.availableItemId].remaining_qty - item.changedQty),
  //       available_order_id: availableOrder.id,
  //     });
  //   }


  //   // CLEAN UP - REVERT ACTION
  //   const revertOrderedItems = [
  //     { availableItemId: '5', itemid: '1', initialOrderedQty: '4', changedQty: '-2' },
  //     { availableItemId: '6', itemid: '2', initialOrderedQty: '10', changedQty: '5' },
  //   ];
  //   await agent
  //     .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //     .set('userid', userid)
  //     .send(revertOrderedItems);

  // });



  // it('should update a Placed Order - creating item', async () => {
  // const mockedPlacedOrder = {
  //   id: '3',
  //   group_id: '1',
  //   user_id: 'user1',
  //   available_order_id: '3',
  // };
  // const availableOrder = {
  //   id = '3',
  //   delivery_status: 'pending',
  //   confirmed_status: false,
  // };
  // const availableItems = {
  //   '5': { initial_qty: 10, remaining_qty: 8 },
  //   '6': { initial_qty: 15, remaining_qty: 0 },
  // };
  // getPlacedOrderById.mockImplementation(() => ({ ok: true, payload: mockedPlacedOrder }));
  // isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: true }));
  // const userid = 'user1';
  // const orderedItems = [
  //   { availableItemId: '5', itemid: '1', initialOrderedQty: '2', changedQty: '2' },
  //   { availableItemId: '6', itemid: '2', initialOrderedQty: '15', changedQty: '-5' },
  // ];

  // const response = await agent
  //   .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //   .set('userid', userid)
  //   .send(orderedItems);
  // console.log('TEST response.body =>', response.body);

  // // CHECK RESPONSE
  // expect(response.statusCode).toEqual(201);
  // expect(response.body.ok).toBeTruthy();
  // // expect(response.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  // // expect(response.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // // expect(response.body.payload).toHaveProperty('delivery_status', availableOrder.delivery_status);
  // // expect(response.body.payload).toHaveProperty('confirmed_status', availableOrder.confirmed_status);
  // // expect(response.body.payload).toHaveProperty('ordered_items');
  // // expect(response.body.payload.ordered_items).toMatchObject([
  // //   { itemQty: 4, itemName: 'Group1 Item 1', itemDescription: 'Group1 Item1 Description', itemPrice: '10.00' },
  // //   { itemQty: 10, itemName: 'Group1 Item 2', itemDescription: 'Group1 Item2 Description', itemPrice: '15.00' },
  // // ]);

  // // CHECK DB CONTENT
  // const placedOrderDBResponse = await agent.get(`/tests/placed-orders/${mockedPlacedOrder.id}`);
  // expect(placedOrderDBResponse.statusCode).toEqual(200);
  // expect(placedOrderDBResponse.body.ok).toBeTruthy();
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('id', mockedPlacedOrder.id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('user_id', mockedPlacedOrder.user_id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('available_order_id', mockedPlacedOrder.available_order_id);

  // for (let item of mockedPlacedOrder.orderedItems) {
  //   const orderedItemDBResponse = await agent.get(`/tests/ordered-item/${mockedPlacedOrder.id}/${item.itemid}`);
  //   expect(orderedItemDBResponse.statusCode).toEqual(200);
  //   expect(orderedItemDBResponse.body.ok).toBeTruthy();
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('item_id', item.itemid);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('quantity', (item.initialOrderedQty + item.changedQty));
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('available_item_id', item.availableItemId);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('available_order_id', availableOrder.id);


  //   const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
  //   expect(availableItemDBResponse.statusCode).toEqual(200);
  //   expect(availableItemDBResponse.body.ok).toBeTruthy();
  //   expect(availableItemDBResponse.body.payload).toMatchObject({
  //     id: item.availableItemId,
  //     item_id: item.itemid,
  //     initial_qty: availableItems[item.availableItemId].initial_qty,
  //     remaining_qty: (availableItems[item.availableItemId].remaining_qty - item.changedQty),
  //     available_order_id: availableOrder.id,
  //   });
  // }


  // // CLEAN UP - REVERT ACTION
  // const revertOrderedItems = [
  //   { availableItemId: '5', itemid: '1', initialOrderedQty: '4', changedQty: '-2' },
  //   { availableItemId: '6', itemid: '2', initialOrderedQty: '10', changedQty: '5' },
  // ];
  // await agent
  //   .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //   .set('userid', userid)
  //   .send(revertOrderedItems);

  // });




  // it('should update a Placed Order - deleting 1 item', async () => {
  // const mockedPlacedOrder = {
  //   id: '3',
  //   group_id: '1',
  //   user_id: 'user1',
  //   available_order_id: '3',
  // };
  // const availableOrder = {
  //   id = '3',
  //   delivery_status: 'pending',
  //   confirmed_status: false,
  // };
  // const availableItems = {
  //   '5': { initial_qty: 10, remaining_qty: 8 },
  //   '6': { initial_qty: 15, remaining_qty: 0 },
  // };
  // getPlacedOrderById.mockImplementation(() => ({ ok: true, payload: mockedPlacedOrder }));
  // isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: true }));
  // const userid = 'user1';
  // const orderedItems = [
  //   { availableItemId: '5', itemid: '1', initialOrderedQty: '2', changedQty: '2' },
  //   { availableItemId: '6', itemid: '2', initialOrderedQty: '15', changedQty: '-5' },
  // ];

  // const response = await agent
  //   .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //   .set('userid', userid)
  //   .send(orderedItems);
  // console.log('TEST response.body =>', response.body);

  // // CHECK RESPONSE
  // expect(response.statusCode).toEqual(201);
  // expect(response.body.ok).toBeTruthy();
  // // expect(response.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  // // expect(response.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // // expect(response.body.payload).toHaveProperty('delivery_status', availableOrder.delivery_status);
  // // expect(response.body.payload).toHaveProperty('confirmed_status', availableOrder.confirmed_status);
  // // expect(response.body.payload).toHaveProperty('ordered_items');
  // // expect(response.body.payload.ordered_items).toMatchObject([
  // //   { itemQty: 4, itemName: 'Group1 Item 1', itemDescription: 'Group1 Item1 Description', itemPrice: '10.00' },
  // //   { itemQty: 10, itemName: 'Group1 Item 2', itemDescription: 'Group1 Item2 Description', itemPrice: '15.00' },
  // // ]);

  // // CHECK DB CONTENT
  // const placedOrderDBResponse = await agent.get(`/tests/placed-orders/${mockedPlacedOrder.id}`);
  // expect(placedOrderDBResponse.statusCode).toEqual(200);
  // expect(placedOrderDBResponse.body.ok).toBeTruthy();
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('id', mockedPlacedOrder.id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('user_id', mockedPlacedOrder.user_id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('available_order_id', mockedPlacedOrder.available_order_id);

  // for (let item of mockedPlacedOrder.orderedItems) {
  //   const orderedItemDBResponse = await agent.get(`/tests/ordered-item/${mockedPlacedOrder.id}/${item.itemid}`);
  //   expect(orderedItemDBResponse.statusCode).toEqual(200);
  //   expect(orderedItemDBResponse.body.ok).toBeTruthy();
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('item_id', item.itemid);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('quantity', (item.initialOrderedQty + item.changedQty));
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('available_item_id', item.availableItemId);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('available_order_id', availableOrder.id);


  //   const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
  //   expect(availableItemDBResponse.statusCode).toEqual(200);
  //   expect(availableItemDBResponse.body.ok).toBeTruthy();
  //   expect(availableItemDBResponse.body.payload).toMatchObject({
  //     id: item.availableItemId,
  //     item_id: item.itemid,
  //     initial_qty: availableItems[item.availableItemId].initial_qty,
  //     remaining_qty: (availableItems[item.availableItemId].remaining_qty - item.changedQty),
  //     available_order_id: availableOrder.id,
  //   });
  // }


  // // CLEAN UP - REVERT ACTION
  // const revertOrderedItems = [
  //   { availableItemId: '5', itemid: '1', initialOrderedQty: '4', changedQty: '-2' },
  //   { availableItemId: '6', itemid: '2', initialOrderedQty: '10', changedQty: '5' },
  // ];
  // await agent
  //   .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //   .set('userid', userid)
  //   .send(revertOrderedItems);

  // });




  // it('should update a Placed Order - deleting all ordered items then whole Placed Order', async () => {
  // const mockedPlacedOrder = {
  //   id: '3',
  //   group_id: '1',
  //   user_id: 'user1',
  //   available_order_id: '3',
  // };
  // const availableOrder = {
  //   id = '3',
  //   delivery_status: 'pending',
  //   confirmed_status: false,
  // };
  // const availableItems = {
  //   '5': { initial_qty: 10, remaining_qty: 8 },
  //   '6': { initial_qty: 15, remaining_qty: 0 },
  // };
  // getPlacedOrderById.mockImplementation(() => ({ ok: true, payload: mockedPlacedOrder }));
  // isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: true }));
  // const userid = 'user1';
  // const orderedItems = [
  //   { availableItemId: '5', itemid: '1', initialOrderedQty: '2', changedQty: '2' },
  //   { availableItemId: '6', itemid: '2', initialOrderedQty: '15', changedQty: '-5' },
  // ];

  // const response = await agent
  //   .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //   .set('userid', userid)
  //   .send(orderedItems);
  // console.log('TEST response.body =>', response.body);

  // // CHECK RESPONSE
  // expect(response.statusCode).toEqual(201);
  // expect(response.body.ok).toBeTruthy();
  // // expect(response.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  // // expect(response.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // // expect(response.body.payload).toHaveProperty('delivery_status', availableOrder.delivery_status);
  // // expect(response.body.payload).toHaveProperty('confirmed_status', availableOrder.confirmed_status);
  // // expect(response.body.payload).toHaveProperty('ordered_items');
  // // expect(response.body.payload.ordered_items).toMatchObject([
  // //   { itemQty: 4, itemName: 'Group1 Item 1', itemDescription: 'Group1 Item1 Description', itemPrice: '10.00' },
  // //   { itemQty: 10, itemName: 'Group1 Item 2', itemDescription: 'Group1 Item2 Description', itemPrice: '15.00' },
  // // ]);

  // // CHECK DB CONTENT
  // const placedOrderDBResponse = await agent.get(`/tests/placed-orders/${mockedPlacedOrder.id}`);
  // expect(placedOrderDBResponse.statusCode).toEqual(200);
  // expect(placedOrderDBResponse.body.ok).toBeTruthy();
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('id', mockedPlacedOrder.id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('group_id', mockedPlacedOrder.group_id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('user_id', mockedPlacedOrder.user_id);
  // expect(placedOrderDBResponse.body.payload).toHaveProperty('available_order_id', mockedPlacedOrder.available_order_id);

  // for (let item of mockedPlacedOrder.orderedItems) {
  //   const orderedItemDBResponse = await agent.get(`/tests/ordered-item/${mockedPlacedOrder.id}/${item.itemid}`);
  //   expect(orderedItemDBResponse.statusCode).toEqual(200);
  //   expect(orderedItemDBResponse.body.ok).toBeTruthy();
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('item_id', item.itemid);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('quantity', (item.initialOrderedQty + item.changedQty));
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('placed_order_id', mockedPlacedOrder.id);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('available_item_id', item.availableItemId);
  //   expect(orderedItemDBResponse.body.payload).toHaveProperty('available_order_id', availableOrder.id);


  //   const availableItemDBResponse = await agent.get(`/tests/available-item/${item.availableItemId}`);
  //   expect(availableItemDBResponse.statusCode).toEqual(200);
  //   expect(availableItemDBResponse.body.ok).toBeTruthy();
  //   expect(availableItemDBResponse.body.payload).toMatchObject({
  //     id: item.availableItemId,
  //     item_id: item.itemid,
  //     initial_qty: availableItems[item.availableItemId].initial_qty,
  //     remaining_qty: (availableItems[item.availableItemId].remaining_qty - item.changedQty),
  //     available_order_id: availableOrder.id,
  //   });
  // }


  // // CLEAN UP - REVERT ACTION
  // const revertOrderedItems = [
  //   { availableItemId: '5', itemid: '1', initialOrderedQty: '4', changedQty: '-2' },
  //   { availableItemId: '6', itemid: '2', initialOrderedQty: '10', changedQty: '5' },
  // ];
  // await agent
  //   .put(`/orders/placed/${mockedPlacedOrder.id}`)
  //   .set('userid', userid)
  //   .send(revertOrderedItems);

  // });




  it('should not update a Placed Order if current user does not own Placed Order', async () => {
    const mockedPlacedOrder = {
      id: '1',
      group_id: '1',
      user_id: 'user1',
      available_order_id: '1',
    };
    getPlacedOrderById.mockImplementation(() => ({ ok: true, payload: mockedPlacedOrder }));
    const userid = 'user2';
    const orderedItems = [];

    const response = await agent
      .put(`/orders/placed/${mockedPlacedOrder.id}`)
      .set('userid', userid)
      .send(orderedItems);

    expect(response.statusCode).toEqual(401);

  });


  it('should not update a Placed Order if Placed Order is not editable', async () => {
    const mockedPlacedOrder = {
      id: '1',
      group_id: '1',
      user_id: 'user1',
      available_order_id: '1',
    };
    getPlacedOrderById.mockImplementation(() => ({ ok: true, payload: mockedPlacedOrder }));
    isPlacedOrderEditable.mockImplementation(() => ({ ok: true, payload: false }));
    const userid = 'user1';
    const orderedItems = [];

    const response = await agent
      .put(`/orders/placed/${mockedPlacedOrder.id}`)
      .set('userid', userid)
      .send(orderedItems);

    expect(response.statusCode).toEqual(401);

  });


});