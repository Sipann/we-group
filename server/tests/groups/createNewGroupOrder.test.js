'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import Mockdate from 'mockdate';

import { test } from '../../src/config';
import { testsRouter, groupsRouter } from '../../src/router_new';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';
import { doesAvailableOrderExist } from '../../src/models/utilsModels/doesAvailableOrderExist';

let server, agent;

beforeAll(() => {
  Mockdate.set(test.TEST_MOCK_DATE);
});

afterAll(() => {
  Mockdate.reset();
});

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
jest.mock('../../src/models/utilsModels/doesAvailableOrderExist', () => ({
  doesAvailableOrderExist: jest.fn(),
}));


describe('createNewGroupOrder', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should create a new available order', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    doesAvailableOrderExist.mockImplementation(() => ({ ok: true, payload: false }));

    const groupid = '1';
    const userid = 'user1';

    const newAvailableOrder = {
      deadlineTs: new Date('2020-11-08T18:00:00'),
      deliveryTs: new Date('2020-11-09T12:00:00'),
    };

    const response = await agent
      .post(`/groups/available-order/${groupid}`)
      .set('userid', userid)
      .send(newAvailableOrder);

    const expected = {
      deadline_ts: '2020-11-08T17:00:00.000Z',
      delivery_ts: '2020-11-09T11:00:00.000Z',
      delivery_status: null,
      confirmed_status: null,
      group_id: groupid,
    };

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(new Date(response.body.payload.deadline_ts)).toEqual(new Date(expected.deadline_ts));
    expect(new Date(response.body.payload.delivery_ts)).toEqual(new Date(expected.delivery_ts));
    expect(response.body.payload.delivery_status).toBeNull();
    expect(response.body.payload.confirmed_status).toBeNull();
    expect(response.body.payload).toHaveProperty('group_id', expected.group_id);


    // CHECK DB CONTENT
    const contentDBResponse = await agent.get(`/tests/available-order/${response.body.payload.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('id', response.body.payload.id);
    expect(new Date(contentDBResponse.body.payload.deadline_ts)).toEqual(new Date(expected.deadline_ts));
    expect(new Date(contentDBResponse.body.payload.delivery_ts)).toEqual(new Date(expected.delivery_ts));
    expect(contentDBResponse.body.payload.delivery_status).toBeNull();
    expect(contentDBResponse.body.payload.confirmed_status).toBeNull();
    expect(contentDBResponse.body.payload).toHaveProperty('group_id', expected.group_id);


    // CLEANUP - REVERT ACTION
    await agent.delete(`/tests/available-order/${response.body.payload.id}`);

  });


  it('should not create a new "available order" for a group with same deadlineTs and same deliveryTs', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    doesAvailableOrderExist.mockImplementation(() => ({ ok: true, payload: true }));

    const groupid = '1';
    const userid = 'user1';

    const newAvailableOrder = {
      deadlineTs: '2020-09-18 02:00:00+02',
      deliveryTs: '2020-09-20 02:00:00+02',
    };

    const response = await agent
      .post(`/groups/available-order/${groupid}`)
      .set('userid', userid)
      .send(newAvailableOrder);

    expect(response.statusCode).toEqual(202);
  });


  it('should not create a new "available order" for a group if newAvailableOrder.deadlineTs is missing', async () => {

    const groupid = '1';
    const userid = 'user1';

    const newAvailableOrder = {
      deliveryTs: new Date('2020-12-10'),
    };

    const response = await agent
      .post(`/groups/available-order/${groupid}`)
      .set('userid', userid)
      .send(newAvailableOrder);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new "available order" for a group if newAvailableOrder.deliveryTs is missing', async () => {

    const groupid = '1';
    const userid = 'user1';

    const newAvailableOrder = {
      deadlineTs: new Date('2020-11-10'),
    };

    const response = await agent
      .post(`/groups/available-order/${groupid}`)
      .set('userid', userid)
      .send(newAvailableOrder);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new "available order" for a group if userid is missing', async () => {

    const groupid = '1';

    const newAvailableOrder = {
      deadlineTs: new Date('2020-11-10'),
      deliveryTs: new Date('2020-12-10'),
    };

    const response = await agent
      .post(`/groups/available-order/${groupid}`)
      .send(newAvailableOrder);

    expect(response.statusCode).toEqual(401);

  });



  it('should not create a new "available order" for a group if current user is not Group Manager', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const groupid = '1';
    const userid = 'user2';

    const newAvailableOrder = {
      deadlineTs: new Date('2020-11-10'),
      deliveryTs: new Date('2020-12-10'),
    };

    const response = await agent
      .post(`/groups/available-order/${groupid}`)
      .set('userid', userid)
      .send(newAvailableOrder);

    expect(response.statusCode).toEqual(401);

  });

});