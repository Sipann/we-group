'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, userRouter } from '../../src/router_new';
import { isUserDataOwner } from '../../src/models/utilsModels/isUserDataOwner';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(testsRouter.routes());
  app.use(userRouter.routes());

  server = app.listen(4000, (err) => {
    if (err) return done(err);
    agent = _agent(server);
    done();
  });

});

afterEach(async done => {
  return server && server.close(done);
});


jest.mock('../../src/models/utilsModels/isUserDataOwner', () => ({
  isUserDataOwner: jest.fn(),
}));


describe('updateUser', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return correctly updated user when providing required arguments', async () => {

    isUserDataOwner.mockImplementation(() => ({ ok: true, payload: true }));

    const updatedUser = {
      id: 'user1',
      name: 'Bibi',
      email: 'bibi@mail.com',
      phone: '2135467',
      preferred_contact_mode: 'phone',
    };

    const response = await agent
      .put('/user')
      .set('userid', 'user1')
      .send(updatedUser);

    // CHECK RESPONSE
    expect(response.statusCode).toEqual(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(updatedUser);

    // CHECK DB CONTENT
    const contentDBResponse = await agent.get(`/tests/user/${updatedUser.id}`);
    expect(contentDBResponse.statusCode).toEqual(200);
    expect(contentDBResponse.body.ok).toBeTruthy();
    expect(contentDBResponse.body.payload).toMatchObject(updatedUser);

    // CLEAN UP - REVERT ACTION
    await agent
      .put('/user')
      .set('userid', 'user1')
      .send({
        id: 'user1',
        name: 'Bobo',
        email: 'bobo@mail.com',
        phone: null,
        preferred_contact_mode: 'email',
      });

  });


  it('should not update user if name argument is missing', async () => {

    isUserDataOwner.mockImplementation(() => ({ ok: true, payload: true }));

    const updatedUser = {
      id: 'user1',
      email: 'bobo@mail.com',
      phone: '2135467',
      preferred_contact_mode: 'phone',
    };

    const response = await agent
      .put('/user')
      .set('userid', 'user1')
      .send(updatedUser);

    expect(response.statusCode).toEqual(400);

  });


  it('should not update user if email argument is missing', async () => {

    isUserDataOwner.mockImplementation(() => ({ ok: true, payload: true }));

    const updatedUser = {
      id: 'user1',
      name: 'Bibi',
      phone: '2135467',
      preferred_contact_mode: 'phone',
    };

    const response = await agent
      .put('/user')
      .set('userid', 'user1')
      .send(updatedUser);

    expect(response.statusCode).toEqual(400);

  });


  it('should not update user if preferred_contact_mode argument is missing', async () => {

    isUserDataOwner.mockImplementation(() => ({ ok: true, payload: true }));

    const updatedUser = {
      id: 'user1',
      name: 'Bibi',
      email: 'bobo@mail.com',
      phone: '2135467',
    };

    const response = await agent
      .put('/user')
      .set('userid', 'user1')
      .send(updatedUser);

    expect(response.statusCode).toEqual(400);

  });


  it('should not update user if "preferred_contact_mode" is set to "phone" but "phone" value is missing', async () => {

    isUserDataOwner.mockImplementation(() => ({ ok: true, payload: true }));

    const updatedUser = {
      id: 'user1',
      name: 'Bibi',
      email: 'bobo@mail.com',
      phone: '',
      preferred_contact_mode: 'phone',
    };

    const response = await agent
      .put('/user')
      .set('userid', 'user1')
      .send(updatedUser);

    expect(response.statusCode).toEqual(400);

  });


  it('should return Unauthorized if current user does not match updated user', async () => {

    isUserDataOwner.mockImplementation(() => ({ ok: true, payload: false }));

    const updatedUser = {
      id: 'user1',
      name: 'Bibi',
      email: 'bobo@mail.com',
      phone: '2135467',
      preferred_contact_mode: 'phone',
    };

    const response = await agent
      .put('/user')
      .set('userid', 'user2')
      .send(updatedUser);

    expect(response.statusCode).toEqual(401);

  });

});