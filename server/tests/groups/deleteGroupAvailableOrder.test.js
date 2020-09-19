'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../src/router_new';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';
import { getGroupIdOfAvailableOrder } from '../../src/models/utilsModels/getGroupIdOfAvailableOrder';
import { isAvailableOrderEditable } from '../../src/models/utilsModels/isAvailableOrderEditable';
import { fetchPlacedOrdersByAvailableOrder } from '../../src/models/utilsModels/fetchPlacedOrdersByAvailableOrder';

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


jest.mock('../../src/models/utilsModels/isUserGroupManager', () => ({
  isUserGroupManager: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/getGroupIdOfAvailableOrder', () => ({
  getGroupIdOfAvailableOrder: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/isAvailableOrderEditable', () => ({
  isAvailableOrderEditable: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/fetchPlacedOrdersByAvailableOrder', () => ({
  fetchPlacedOrdersByAvailableOrder: jest.fn(),
}));


describe('deleteGroupAvailableOrder', () => {

  it('should return true', () => {
    expect(true).toBeTruthy();
  });

  //! NOT TESTED YET - START
  it('should delete Group\'s Available Order', async () => {
    // getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '' }));
    // isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    // isAvailableOrderEditable.mockImplementation(() => ({ ok: true, payload: true }));
    // fetchPlacedOrdersByAvailableOrder.mockImplementation(() => ({ ok: true, payload: ?? }));

    // const availableOrderId = '9';
    // const userid = 'user3';
    // TODO mockData for this available order / placed orders / ordered items
    // const response = await agent
    //   .delete(`/groups/available-order/${availableOrderId}`)
    //   .set('userid', userid);

    // expect(response.statusCode).toEqual(200);
    // expect(response.body.ok).toBeTruthy();
    // expect(response.body.payload).toEqual(availableOrderId);

  });
  //! NOT TESTED YET - END


  it('should not delete Group\'s Available Order if current user is not Group Manager', async () => {
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '2' }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const availableOrderId = '6';
    const userid = 'user1';

    const response = await agent
      .delete(`/groups/available-order/${availableOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });


  it('should not delete Group\'s Available Order if it is not editable anymore (passed)', async () => {
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true, payload: '1' }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderEditable.mockImplementation(() => ({ ok: true, payload: false }));

    const availableOrderId = '1';
    const userid = 'user1';

    const response = await agent
      .delete(`/groups/available-order/${availableOrderId}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });

});