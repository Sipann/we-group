'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter } from '../../src/router_new';
import { isUserIdValid } from '../../src/models/utilsModels/isUserIdValid';
import { isAvailableOrderIdValid } from '../../src/models/utilsModels/isAvailableOrderIdValid';
import { getGroupIdOfAvailableOrder } from '../../src/models/utilsModels/getGroupIdOfAvailableOrder';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';
import { errorMessages } from '../../src/utils/errorMessages';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
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
jest.mock('../../src/models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../src/models/utilsModels/isAvailableOrderIdValid', () => ({
  isAvailableOrderIdValid: jest.fn(),
}));


describe('areAddAvailableItemArgsValid', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true when all arguments are valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user1';
    const orderid = '1';

    const response = await agent.get(`/tests/are-add-available-item-args-valid/${userid}/${orderid}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return Unauthorized when userid is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'aaa';
    const orderid = '1';

    const response = await agent.get(`/tests/are-add-available-item-args-valid/${userid}/${orderid}`);
    // expect(response.statusCode).toEqual(401);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toEqual(errorMessages.notAllowed);

  });


  it('should return Missing Argument when availableOrderId is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user1';
    const orderid = '1';

    const response = await agent.get(`/tests/are-add-available-item-args-valid/${userid}/${orderid}`);
    // expect(response.statusCode).toEqual(400);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toEqual(errorMessages.missingArguments);

  });


  it('should return Invalid Input when availableOrderId is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: false }));

    const userid = 'user1';
    const orderid = '1';

    const response = await agent.get(`/tests/are-add-available-item-args-valid/${userid}/${orderid}`);
    // expect(response.statusCode).toEqual(400);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toEqual(errorMessages.invalidInput);

  });



  it('should return UnAuthorized when current user is not Group Manager', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isAvailableOrderIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    getGroupIdOfAvailableOrder.mockImplementation(() => ({ ok: true }));
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user2';
    const orderid = '1';

    const response = await agent.get(`/tests/are-add-available-item-args-valid/${userid}/${orderid}`);
    // expect(response.statusCode).toEqual(401);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toEqual(errorMessages.notAllowed);

  });



});