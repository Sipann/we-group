'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../src/router_new';
import { isUserGroupMember } from '../../src/models/utilsModels/isUserGroupMember';
import { isUserGroupManager } from '../../src/models/utilsModels/isUserGroupManager';

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
jest.mock('../../src/models/utilsModels/isUserGroupMember', () => ({
  isUserGroupMember: jest.fn(),
}));


describe('changeGroupManager', () => {

  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should change Group manager', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';
    const groupid = '2';
    const newManagerid = 'user5';

    const response = await agent
      .put(`/groups/group-manager/${groupid}`)
      .set('userid', userid)
      .send({ newManagerid });

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject({
      id: '2',
      name: 'Barajas',
      description: 'Fruits & Vegetables',
      currency: 'eur',
      manager_id: 'user5',
    });

    // CLEAN UP - REVERT ACTION
    await agent
      .put(`/groups/group-manager/${groupid}`)
      .set('userid', newManagerid)
      .send({ newManagerid: userid });

  });


  it('should not change Group manager is new manager is not already member of the group', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user2';
    const groupid = '2';
    const newManagerid = 'user1';

    const response = await agent
      .put(`/groups/group-manager/${groupid}`)
      .set('userid', userid)
      .send(newManagerid);

    expect(response.statusCode).toEqual(400);

  });

  it('should not change Group manager is current user is not current Group manager', async () => {
    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user4';
    const groupid = '2';
    const newManagerid = 'user5';

    const response = await agent
      .put(`/groups/group-manager/${groupid}`)
      .set('userid', userid)
      .send(newManagerid);

    expect(response.statusCode).toEqual(401);
  });

});