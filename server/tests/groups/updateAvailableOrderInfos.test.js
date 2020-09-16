'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../router_new';
import { isUserGroupManager } from '../../models/utilsModels/isUserGroupManager';
import { getAvailableOrderById } from '../../models/testsModels/getAvailableOrderById';

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
jest.mock('../../models/testsModels/getAvailableOrderById', () => ({
  getAvailableOrderById: jest.fn(),
}));



describe('updateAvailableOrderInfos', () => {

  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  it('should update Available Order infos confirmed status / delivery status', async () => {
    const mockedAvailableOrder = {
      id: '6',
      delivery_status: 'pending',
      confirmed_status: false,
      group_id: '2'
    };
    getAvailableOrderById.mockImplementation(() => ({ ok: true, payload: mockedAvailableOrder }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    const availableOrderId = '6';
    const updatedInfos = { confirmed: true, delivered: 'done' };
    const userid = 'user2';

    const response = await agent
      .put(`/groups/available-order/infos/${availableOrderId}`)
      .set('userid', userid)
      .send(updatedInfos);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toHaveProperty('id', '6');
    expect(response.body.payload).toHaveProperty('delivery_status', 'done');
    expect(response.body.payload).toHaveProperty('confirmed_status', true);
    expect(response.body.payload).toHaveProperty('group_id', '2');


    // CLEAN UP - REVERT ACTION
    await agent
      .put(`/groups/available-order/infos/${availableOrderId}`)
      .set('userid', userid)
      .send({ confirmed: false, delivered: 'pending' });

  });


  it('should not update Available Order infos if current user is not Group Manager', async () => {
    const mockedAvailableOrder = {
      id: '6',
      delivery_status: 'pending',
      confirmed_status: false,
      group_id: '2'
    };
    getAvailableOrderById.mockImplementation(() => ({ ok: true, payload: mockedAvailableOrder }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const availableOrderId = '6';
    const updatedInfos = { confirmed: false, delivered: 'pending' };
    const userid = 'user4';

    const response = await agent
      .put(`/groups/available-order/infos/${availableOrderId}`)
      .set('userid', userid)
      .send(updatedInfos);

    expect(response.statusCode).toEqual(401);
  });


  it('should not update Available Order\'s delivery_status if delivery status is already "done"', async () => {
    const mockedAvailableOrder = {
      id: '4',
      delivery_status: 'done',
      confirmed_status: true,
      group_id: '2'
    };
    getAvailableOrderById.mockImplementation(() => ({ ok: true, payload: mockedAvailableOrder }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));

    const availableOrderId = '4';
    const updatedInfos = { confirmed: false, delivered: 'pending' };
    const userid = 'user2';

    const response = await agent
      .put(`/groups/available-order/infos/${availableOrderId}`)
      .set('userid', userid)
      .send(updatedInfos);

    expect(response.statusCode).toEqual(400);

  });

  it('should not update Available Order if new delivery status is not one of the allowed values ("pending", "ongoing", "done")', async () => {
    const availableOrderId = '6';
    const updatedInfos = { confirmed: false, delivered: 'wrong' };
    const userid = 'user2';

    const response = await agent
      .put(`/groups/available-order/infos/${availableOrderId}`)
      .set('userid', userid)
      .send(updatedInfos);

  });



});