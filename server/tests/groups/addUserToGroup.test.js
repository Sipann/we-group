'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../router_new';
import { isUserGroupMember } from '../../models/utilsModels/isUserGroupMember';
import { isUserIdValid } from '../../models/utilsModels/isUserIdValid';
import { isGroupIdValid } from '../../models/utilsModels/isGroupIdValid';

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


jest.mock('../../models/utilsModels/isUserGroupMember', () => ({
  isUserGroupMember: jest.fn(),
}));
jest.mock('../../models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/isGroupIdValid', () => ({
  isGroupIdValid: jest.fn(),
}));


describe('addUserToGroup', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should add user to group - return that group', async () => {

    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: false }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const groupid = '2';
    const userid = 'user1';

    const response = await agent
      .post(`/groups/user/${groupid}`)
      .set('userid', userid)
      .send();

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject({
      id: groupid,
      name: 'Barajas',
      description: 'Fruits & Vegetables',
      manager_id: 'user2',
    });

    // CHECK DB CONTENT
    const contentDBResponse = await agent.get(`/tests/groupsusers/${groupid}/${userid}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('group_id', groupid);
    expect(contentDBResponse.body.payload).toHaveProperty('user_id', userid);

    // CLEANUP - REVERT ACTION
    await agent.delete(`/tests/groupsusers/${groupid}/${userid}`);

  });


  it('should return 202 when a user asks to join a group he is already a member of', async () => {

    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user4'

    const response = await agent
      .post('/groups/user/2')
      .set('userid', userid)
      .send();

    expect(response.statusCode).toEqual(202);

  });


  it('should return 401 when userid argument is missing', async () => {

    const response = await agent
      .post('/groups/user/2')
      .send();

    expect(response.statusCode).toEqual(401);

  });


  it('should return 401 when userid argument is wrong', async () => {

    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: false }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));


    const userid = 'user2';

    const response = await agent
      .post('/groups/user/2')
      .set('userid', userid)
      .send();

    expect(response.statusCode).toEqual(401);

  });


  it('should return 400 when groupid argument is wrong', async () => {

    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: false }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: false }));


    const userid = 'user2';

    const response = await agent
      .post('/groups/user/wronggroupid')
      .set('userid', userid)
      .send();

    expect(response.statusCode).toEqual(400);

  });

});
