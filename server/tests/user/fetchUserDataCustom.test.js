'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, userRouter } from '../../src/router_new';
import { isUserIdValid } from '../../src/models/utilsModels/isUserIdValid';
import { fetchUserData } from '../../src/models/utilsModels/fetchUserData';
import { fetchGroupsUserIsMemberOf } from '../../src/models/utilsModels/fetchGroupsUserIsMemberOf';
import { fetchUserPlacedOrders } from '../../src/models/utilsModels/fetchUserPlacedOrders';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(testsRouter.routes());
  app.use(userRouter.routes());

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
jest.mock('../../src/models/utilsModels/fetchUserData', () => ({
  fetchUserData: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/fetchGroupsUserIsMemberOf', () => ({
  fetchGroupsUserIsMemberOf: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/fetchUserPlacedOrders', () => ({
  fetchUserPlacedOrders: jest.fn(),
}));


describe('fetchUserDataCustom', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return userDetails, userGroups and userOrders of a user', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    fetchUserData.mockImplementation(() => ({ ok: true, payload: {} }));
    fetchGroupsUserIsMemberOf.mockImplementation(() => ({ ok: true, payload: [] }));
    fetchUserPlacedOrders.mockImplementation(() => ({ ok: true, payload: [] }));

    const userid = 'user1';

    const response = await agent
      .get('/user')
      .set('userid', userid);

    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toHaveProperty('userDetails');
    expect(response.body.payload).toHaveProperty('userGroups');
    expect(response.body.payload).toHaveProperty('userOrders');

  });

  it('should throw an error when userId is invalid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const wrongUserid = 'wronguser';

    const response = await agent
      .get('/user')
      .set('userid', wrongUserid);

    expect(response.statusCode).toEqual(401);
  });



});