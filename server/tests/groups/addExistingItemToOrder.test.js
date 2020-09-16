'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../router_new';
import { areAddAvailableItemArgsValid } from '../../models/utilsModels/areAddAvailableItemArgsValid';
import { returnAddedItem } from '../../models/utilsModels/returnAddedItem';
import { errorMessages } from '../../utils/errorMessages';

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


jest.mock('../../models/utilsModels/areAddAvailableItemArgsValid', () => ({
  areAddAvailableItemArgsValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/returnAddedItem', () => ({
  returnAddedItem: jest.fn(),
}));


describe('addExistingItemToOrder', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should add an existing item to available_items', async () => {

    areAddAvailableItemArgsValid.mockImplementation(() => ({ ok: true, payload: true }));
    const returned = {
      availableItemId: true,
      availableItemInitialQty: 8,
      availableItemRemainingQty: 8,
      itemid: '3',
      itemName: 'Group1 Item 3',
      itemDescription: 'Group1 Item3 Description',
      itemPrice: '25.00'
    };
    returnAddedItem.mockImplementation(() => ({ ok: true, payload: { ...returned } }));

    const orderid = '1';
    const userid = 'user1';

    const itemData = {
      itemid: '3',
      initialQty: 8,
    };

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .set('userid', userid)
      .send(itemData);


    // CHECK RESPONSE
    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(returned);


    // CHECK DB CONTENT
    const contentDBResponse = await agent.get('/tests/available-item/last-inserted');
    expect(contentDBResponse.statusCode).toEqual(200);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('item_id', '3');
    expect(contentDBResponse.body.payload).toHaveProperty('initial_qty', 8);
    expect(contentDBResponse.body.payload).toHaveProperty('remaining_qty', 8);
    expect(contentDBResponse.body.payload).toHaveProperty('available_order_id', '1');


    // CLEANUP
    await agent.delete(`/tests/available-item/${contentDBResponse.body.payload.id}`);

  });


  it('should not add item to available_items if orderid is not valid', async () => {

    areAddAvailableItemArgsValid.mockImplementation(() => ({ ok: true, payload: errorMessages.missingArguments }));

    const orderid = '1';
    const userid = 'user1';

    const itemData = {
      itemid: '3',
      initialQty: 8,
    };

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .set('userid', userid)
      .send(itemData);

    expect(response.statusCode).toEqual(400);
  });


  it('should not add item to available_items if userid is not valid', async () => {

    areAddAvailableItemArgsValid.mockImplementation(() => ({ ok: true, payload: errorMessages.notAllowed }));

    const orderid = '1';
    const userid = 'user2';  // userid valid but not Group1 Manager.

    const itemData = {
      itemid: '3',
      initialQty: 8,
    };

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .set('userid', userid)
      .send(itemData);

    expect(response.statusCode).toEqual(401);
  });



  it('should not add item to available_items if userid is not provided', async () => {
    const orderid = '1';

    const itemData = {
      itemid: '3',
      initialQty: 8,
    };

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .send(itemData);

    expect(response.statusCode).toEqual(401);
  });

  it('should not add item to available_items if item is not provided', async () => {
    const userid = 'user1';
    const orderid = '1';

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .set('userid', userid)
      .send();

    expect(response.statusCode).toEqual(400);
  });


  it('should not add item to available_items if no itemid is provided', async () => {
    const userid = 'user1';
    const orderid = '1';

    const itemData = {
      initialQty: 8,
    };

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .set('userid', userid)
      .send(itemData);

    expect(response.statusCode).toEqual(400);
  });


  it('should not add item to available_items if no itemQty is provided', async () => {
    const userid = 'user1';
    const orderid = '1';

    const itemData = {
      itemid: '3',
    };

    const response = await agent
      .post(`/groups/available-order/existing-item/${orderid}`)
      .set('userid', userid)
      .send(itemData);

    expect(response.statusCode).toEqual(400);
  });

});