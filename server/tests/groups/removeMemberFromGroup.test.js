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


describe('removeMemberFromGroup', () => {

  // smoke test
  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  // it('should remove member from group (groupsusers)', async () => {
  //   isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
  //   isUserRemovable.mockImplementation(() => ({ ok: true, payload: true }));

  //   const userid = 'user2';
  //   const groupid = '2';
  //   const removedUserid = 'user5';

  //   const response = await agent
  //     .delete(`/groups/remove-member/${groupid}`)
  //     .set('userid', userid)
  //     .send({ removedUserid });

  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body.ok).toBeTruthy();
  //   expect(response.body.payload).toBeTruthy();

  // });


  it('should not remove member from group if removed user is not removable', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));
    isUserRemovable.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user2';
    const groupid = '2';
    const removedUserid = 'user5';

    const response = await agent
      .delete(`/groups/remove-member/${groupid}`)
      .set('userid', userid)
      .send({ removedUserid });

    expect(response.statusCode).toEqual(401);

  });


  it('should not remove member from group if removed user id is missing', async () => {

    const userid = 'user5';
    const groupid = '2';

    const response = await agent
      .delete(`/groups/remove-member/${groupid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(400);

  });


  it('should not remove member from group if current user is not Group Manager', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user5';
    const groupid = '2';
    const removedUserid = 'user4';

    const response = await agent
      .delete(`/groups/remove-member/${groupid}`)
      .set('userid', userid)
      .send({ removedUserid });

    expect(response.statusCode).toEqual(401);

  });

});