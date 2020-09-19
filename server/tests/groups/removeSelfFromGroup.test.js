'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../src/router_new';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';
import { isUserRemovable } from '../../src/models/utilsModels/isUserRemovable';

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
jest.mock('../../src/models/utilsModels/isUserRemovable', () => ({
  isUserRemovable: jest.fn(),
}));


describe('removeSelfFromGroup', () => {

  // smoke test
  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  // it('should remove current user from group', async () => {
  //   isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));
  //   isUserRemovable.mockImplementation(() => ({ ok: true, payload: true }));
  //   const groupid = '??';
  //   const userid = '??';

  //   const response = await agent
  //     .delete(`/groups/remove-self/${groupid}`)
  //     .set('userid', userid);

  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body.ok).toBeTruthy();
  //   expect(response.body.payload).toBeTruthy();
  // });


  it('should not remove current user if current user is Group Manager', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    const groupid = '2';
    const userid = 'user2';

    const response = await agent
      .delete(`/groups/remove-self/${groupid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);
  });


  it('should not remove current user is current user is not removable (has pending placed orders for this group', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));
    isUserRemovable.mockImplementation(() => ({ ok: true, payload: false }));
    const groupid = '2';
    const userid = 'user5';

    const response = await agent
      .delete(`/groups/remove-self/${groupid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);

  });


  it('should not remove current user if userid is missing', async () => {
    const groupid = '2';

    const response = await agent.delete(`/groups/remove-self/${groupid}`);

    expect(response.statusCode).toEqual(400);
  });

});