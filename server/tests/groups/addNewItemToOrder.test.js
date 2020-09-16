'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../router_new';
import { isUserGroupManager } from '../../models/utilsModels/isUserGroupManager';
import { getGroupIdOfAvailableOrder } from '../../models/utilsModels/getGroupIdOfAvailableOrder';
import { isUserIdValid } from '../../models/utilsModels/isUserIdValid';
import { isAvailableOrderIdValid } from '../../models/utilsModels/isAvailableOrderIdValid';


let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(groupsRouter.routes());
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


jest.mock('../../models/utilsModels/isUserGroupManager', () => ({
  isUserGroupManager: jest.fn(),
}));
jest.mock('../../models/utilsModels/getGroupIdOfAvailableOrder', () => ({
  getGroupIdOfAvailableOrder: jest.fn(),
}));
jest.mock('../../models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/isAvailableOrderIdValid', () => ({
  isAvailableOrderIdValid: jest.fn(),
}));


describe('addNewItemToOrder', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should create a new item in items and available_items tables', async () => {

    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '1' }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const availableOrderid = '1';   // group1 => manager_id => 'user1'
    const userid = 'user1';

    const item = {
      itemName: 'item name',
      itemDescription: 'item description',
      itemPrice: 10,
      itemInitialQty: 20,
    };

    const response = await agent
      .post(`/groups/available-order/new-item/${availableOrderid}`)
      .set('userid', userid)
      .send(item);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toHaveProperty('availableitemid');
    expect(response.body.payload).toHaveProperty('availableiteminitialqty', 20);
    expect(response.body.payload).toHaveProperty('availableitemremainingqty', 20);
    expect(response.body.payload).toHaveProperty('itemid');
    expect(response.body.payload).toHaveProperty('itemname', 'item name');
    expect(response.body.payload).toHaveProperty('itemdescription', 'item description');
    expect(response.body.payload).toHaveProperty('itemprice', '10.00');


    // CHECK DB CONTENT
    const contentItemDBResponse = await agent
      .get(`/tests/items/${response.body.payload.itemid}`);

    const contentItemDBExpected = {
      id: response.body.payload.itemid,
      name: 'item name',
      description: 'item description',
      price: '10.00',
      group_id: '1',
    };

    expect(contentItemDBResponse.statusCode).toEqual(200);
    expect(contentItemDBResponse.body.ok).toBeTruthy();
    expect(contentItemDBResponse.body.payload).toMatchObject(contentItemDBExpected);

    const contentAvailableItemDBResponse = await agent
      .get(`/tests/available-item/${response.body.payload.availableitemid}`);

    const contentAvailableItemDBExpected = {
      id: response.body.payload.availableitemid,
      item_id: response.body.payload.itemid,
      initial_qty: 20,
      remaining_qty: 20,
      available_order_id: '1',
    }

    expect(contentAvailableItemDBResponse.statusCode).toEqual(200);
    expect(contentAvailableItemDBResponse.body.ok).toBeTruthy();
    expect(contentAvailableItemDBResponse.body.payload).toMatchObject(contentAvailableItemDBExpected);


    // CLEANUP - REVERT ACTION
    await agent
      .delete(`/tests/available-item/${response.body.payload.availableitemid}`);
    await agent
      .delete(`/tests/items/${response.body.payload.itemid}`);

  });



  it('should not create a new item if the userid is missing', async () => {

    const availableOrderid = '1';   // group1 => manager_id => 'user1'

    const item = {
      itemName: 'item name',
      itemDescription: 'item description',
      itemPrice: 10,
      itemInitialQty: 20,
    };

    const response = await agent
      .post(`/groups/available-order/new-item/${availableOrderid}`)
      .send(item);

    expect(response.statusCode).toEqual(401);

  });



  it('should not create a new item if the itemName is missing on the item argument', async () => {

    const availableOrderid = '1';   // group1 => manager_id => 'user1'
    const userid = 'user1';

    const item = {
      itemDescription: 'item description',
      itemPrice: 10,
      itemInitialQty: 20,
    };

    const response = await agent
      .post(`/groups/available-order/new-item/${availableOrderid}`)
      .set('userid', userid)
      .send(item);

    expect(response.statusCode).toEqual(400);

  });



  it('should not create a new item if the itemDescription is missing on the item argument', async () => {

    const availableOrderid = '1';   // group1 => manager_id => 'user1'
    const userid = 'user1';

    const item = {
      itemName: 'item name',
      itemPrice: 10,
      itemInitialQty: 20,
    };

    const response = await agent
      .post(`/groups/available-order/new-item/${availableOrderid}`)
      .set('userid', userid)
      .send(item);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new item if the current user is not the Group Manager', async () => {

    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '1' }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const availableOrderid = '1';   // group1 => manager_id => 'user1'
    const userid = 'user2';

    const item = {
      itemName: 'item name',
      itemDescription: 'item description',
      itemPrice: 10,
      itemInitialQty: 20,
    };

    const response = await agent
      .post(`/groups/available-order/new-item/${availableOrderid}`)
      .set('userid', userid)
      .send(item);

    expect(response.statusCode).toEqual(401);

  });


});