'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter } from '../../router_new';
import { getLightGroupMembers } from '../../models/utilsModels/getLightGroupMembers';

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

const mockedGetLightGroupmembers = {
  ok: true,
  payload: [
    { id: 'user2', name: 'Lili' },
    { id: 'user4', name: 'Lola' },
    { id: 'user5', name: 'Sisi' },
  ],
};
jest.mock('../../models/utilsModels/getLightGroupMembers');
getLightGroupMembers.mockImplementation(() => mockedGetLightGroupmembers);


describe('isUserGroupMember', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true if user is member of group', async () => {

    const userid = 'user4';
    const groupid = 2;

    const response = await agent.get(`/tests/is-user-group-member/${userid}/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();
  });


  it('should return true is user is member and manager of group', async () => {

    const userid = 'user2';
    const groupid = 2;

    const response = await agent.get(`/tests/is-user-group-member/${userid}/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();
  });


  it('should return false is user is not member of group', async () => {

    const userid = 'user1';
    const groupid = 2;

    const response = await agent.get(`/tests/is-user-group-member/${userid}/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();
  });


});