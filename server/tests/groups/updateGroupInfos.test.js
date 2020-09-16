'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../router_new';
import { isUserGroupManager } from '../../models/utilsModels/isUserGroupManager';
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


jest.mock('../../models/utilsModels/isUserGroupManager', () => ({
  isUserGroupManager: jest.fn(),
}));
jest.mock('../../models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));
jest.mock('../../models/utilsModels/isGroupIdValid', () => ({
  isGroupIdValid: jest.fn(),
}));


describe('updateGroupInfos', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should update group infos (name, description, currency)', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';

    const updatedGroup = {
      id: '2',
      name: 'Cartalade',
      description: 'New description',
      currency: 'eur',
      manager_id: userid,
    };

    const response = await agent
      .put('/groups')
      .set('userid', userid)
      .send(updatedGroup);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(updatedGroup);


    // CHECK DB CONTENT
    const contentDBResponse = await await agent.get(`/tests/group/${updatedGroup.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('name', updatedGroup.name);
    expect(contentDBResponse.body.payload).toHaveProperty('description', updatedGroup.description);

    // CLEANUP - REVERT
    await agent.put('/groups')
      .set('userid', userid)
      .send({
        id: '2',
        name: 'Barajas',
        description: 'Fruits & Vegetables',
        currency: 'eur',
        manager_id: userid,
      });

  });


  it('should not update the group infos if name argument is missing', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';

    const updatedGroup = {
      id: '2',
      description: 'New description',
      currency: 'eur',
      manager_id: 'user2',
    };

    const response = await agent
      .put('/groups')
      .set('userid', userid)
      .send(updatedGroup);

    expect(response.statusCode).toEqual(400);

    const contentDBResponse = await agent.get(`/tests/group/${updatedGroup.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('name', 'Barajas');
    expect(contentDBResponse.body.payload).toHaveProperty('description', 'Fruits & Vegetables');

  });


  it('should not update the group infos if description argument is missing', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';

    const updatedGroup = {
      id: '2',
      name: 'Cartalade',
      currency: 'eur',
      manager_id: 'user2',
    };

    const response = await agent
      .put('/groups')
      .set('userid', userid)
      .send(updatedGroup);

    expect(response.statusCode).toEqual(400);

    const contentDBResponse = await agent.get(`/tests/group/${updatedGroup.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('name', 'Barajas');
    expect(contentDBResponse.body.payload).toHaveProperty('description', 'Fruits & Vegetables');

  });


  it('should not update the group infos if userid argument is missing', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const updatedGroup = {
      id: '2',
      name: 'Cartalade',
      description: 'New description',
      currency: 'eur',
      manager_id: 'user2',
    };

    const response = await agent
      .put('/groups')
      .send(updatedGroup);

    expect(response.statusCode).toEqual(401);

    const contentDBResponse = await agent.get(`/tests/group/${updatedGroup.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('name', 'Barajas');
    expect(contentDBResponse.body.payload).toHaveProperty('description', 'Fruits & Vegetables');

  });


  it('should not update the group infos if userid is invalid', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: true }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'wronguserid';

    const updatedGroup = {
      id: '2',
      name: 'Cartalade',
      description: 'New description',
      currency: 'eur',
      manager_id: 'user2',
    };

    const response = await agent
      .put('/groups')
      .set('userid', userid)
      .send(updatedGroup);

    expect(response.statusCode).toEqual(401);

    const contentDBResponse = await agent.get(`/tests/group/${updatedGroup.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('name', 'Barajas');
    expect(contentDBResponse.body.payload).toHaveProperty('description', 'Fruits & Vegetables');

  });


  it('should not update the group infos if current user is not group manager', async () => {

    isUserGroupManager.mockImplementation(() => ({ ok: true, payload: false }));
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    isGroupIdValid.mockImplementation(() => ({ ok: true, payload: true }));

    const userid = 'user2';

    const updatedGroup = {
      id: '2',
      name: 'Cartalade',
      description: 'New description',
      currency: 'eur',
      manager_id: 'user2',
    };

    const response = await agent
      .put('/groups')
      .set('userid', userid)
      .send(updatedGroup);

    expect(response.statusCode).toEqual(401);

    const contentDBResponse = await agent.get(`/tests/group/${updatedGroup.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('name', 'Barajas');
    expect(contentDBResponse.body.payload).toHaveProperty('description', 'Fruits & Vegetables');

  });


});
