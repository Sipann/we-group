'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, groupsRouter } from '../../src/router_new';

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

describe('createGroup', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return a newly created group when route hit with correct arguments', async () => {
    const newGroup = {
      name: 'GroupA',
      description: 'GroupA description',
      currency: 'eur',
    };
    const userid = 'user1';

    const expected = {
      name: 'GroupA',
      description: 'GroupA description',
      currency: 'eur',
      manager_id: userid,
    };

    // CHECK RESPONSE
    const response = await agent
      .post('/groups')
      .set('userid', userid)
      .send(newGroup);

    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toHaveProperty('id');
    expect(response.body.payload).toHaveProperty('name', expected.name);
    expect(response.body.payload).toHaveProperty('description', expected.description);
    expect(response.body.payload).toHaveProperty('currency', expected.currency);
    expect(response.body.payload).toHaveProperty('manager_id', expected.manager_id);

    // CHECK DB CONTENT
    const contentDBResponse = await agent.get(`/tests/group/${response.body.payload.id}`);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toHaveProperty('id', response.body.payload.id);
    expect(contentDBResponse.body.payload).toHaveProperty('name', expected.name);
    expect(contentDBResponse.body.payload).toHaveProperty('description', expected.description);
    expect(contentDBResponse.body.payload).toHaveProperty('currency', expected.currency);
    expect(contentDBResponse.body.payload).toHaveProperty('manager_id', expected.manager_id);

    // CLEANUP - REVERT ACTION
    await agent.delete(`/tests/group/${response.body.payload.id}`);

  });

  it('should not create a new group if the name argument is missing', async () => {
    const newGroup = {
      description: 'GroupB description',
      currency: 'eur',
    };
    const userid = 'user1';

    const response = await agent
      .post('/groups')
      .set('userid', userid)
      .send(newGroup);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new group if the description argument is missing', async () => {
    const newGroup = {
      name: 'GroupB',
      currency: 'eur',
    };
    const userid = 'user1';

    const response = await agent
      .post('/groups')
      .set('userid', userid)
      .send(newGroup);

    expect(response.statusCode).toEqual(400);

  });


  it('should not create a new group if the currency argument is missing', async () => {
    const newGroup = {
      name: 'GroupB',
      description: 'GroupB description',
    };
    const userid = 'user1';

    const response = await agent
      .post('/groups')
      .set('userid', userid)
      .send(newGroup);

    expect(response.statusCode).toEqual(400);

  });

  it('should not create a new group if the userid is missing', async () => {
    const newGroup = {
      name: 'GroupC',
      description: 'GroupC description',
      currency: 'eur',
    };

    const response = await agent
      .post('/groups')
      .send(newGroup);

    expect(response.statusCode).toEqual(401);
  });

});
