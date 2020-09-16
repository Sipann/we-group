'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../router_new';
import { isUserGroupManager } from '../../models/utilsModels/isUserGroupManager';

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


describe('fetchGroupMembers', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should fetch all members of a given group', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';
    const groupid = '2';

    const response = await agent
      .get(`/groups/members/${groupid}`)
      .set('userid', userid);


    const expected = [
      { "userid": "user3", "username": "Baba" },
      { "userid": "user4", "username": "Lola" },
      { "userid": "user5", "username": "Sisi" },
      { "userid": "user8", "username": "Nono" },
    ];

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(Array.isArray(response.body.payload)).toBeTruthy();
    // console.log('TEST RESPONSE =>', response.body.payload);
    //TODO isEqual response.body.payload VS expected

    // const expectedReduced = expected.reduce((acc, curr) => {
    //   acc[curr.userid] = curr.username;
    //   return acc;
    // }, {});

    // const responseBodyReduced = response.body.payload.reduce((acc, curr) => {
    //   acc[curr.userid] = curr.username;
    //   return acc;
    // }, {});

    // expect(responseBodyReduced).toMatchObject(expectedReduced);

  });


  it('should not fetch group members if current user is not Group Manager', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));

    const userid = 'user1';
    const groupid = '2';

    const response = await agent
      .get(`/groups/members/${groupid}`)
      .set('userid', userid);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(401);

  });

  it('should not fetch group members if userid is missing', async () => {

    const groupid = '2';
    const response = await agent.get(`/groups/members/${groupid}`);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(401);

  });

});