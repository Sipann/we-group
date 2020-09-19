'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../src/router_new';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';
import { isGroupDeletable } from '../../src/models/utilsModels/isGroupDeletable';

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
jest.mock('../../src/models/utilsModels/isGroupDeletable', () => ({
  isGroupDeletable: jest.fn(),
}));


describe('deleteGroup', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should delete group => setting manager id to null', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupDeletable.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';
    const groupid = '2';

    const response = await agent
      .delete(`/groups/${groupid}`)
      .set('userid', userid);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toEqual(groupid);

    // CHECK DB CONTENT
    const contentDBResponse = await agent.get(`/tests/group/${groupid}`);
    expect(contentDBResponse.statusCode).toEqual(200);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload.manager_id).toBeNull();


    // CLEAN UP - REVERT ACTION
    await agent.put(`/tests/group-manager-id/${groupid}/${userid}`);

  });


  it('should not delete group if group is not deletable (has pending available orders)', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupDeletable.mockImplementation(() => ({ ok: true, payload: false }));
    const userid = 'user2';
    const groupid = '2';

    const response = await agent
      .delete(`/groups/:${groupid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });


  it('should not delete group if current user is not group manager', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));
    const userid = 'user5';
    const groupid = '3';

    const response = await agent
      .delete(`/groups/:${groupid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });

});