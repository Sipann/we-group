'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter, userRouter } from '../../src/router_new';
import { isUserDeletable } from '../../src/models/utilsModels/isUserDeletable';
import { getUserById } from '../../src/models/testsModels/getUserById';   //! move to utilsModels

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


jest.mock('../../src/models/utilsModels/isUserDeletable', () => ({
  isUserDeletable: jest.fn(),
}));
jest.mock('../../src/models/testsModels/getUserById', () => ({        //! moved
  getUserById: jest.fn(),
}));


describe('deleteUser', () => {

  // smoke test
  it('should return true', () => {
    expect(true).toBeTruthy();
  });


  // it('should deleteUser', async () => {
  //   const mockedUser = {
  //     id: 'user9',
  //     name: 'User9',
  //     email: 'user9@mail.com',
  //     preferred_contact_mode: 'email',
  //   };
  //   isUserDeletable.mockImplementation(() => ({ ok: true, payload: true }));
  //   getUserById.mockImplementation(() => ({ ok: true, payload: mockedUser }))

  //   // CHECK DB CONTENT BEFORE MODIFICATION
  //   const groupsUsersResponse = await agent
  //     .get('/tests/fetch-groups-user-is-member-of')
  //     .set('userid', mockedUser.id);
  //   const groupsUserIsMemberOf = groupsUsersResponse.payload;


  //   const response = await agent
  //     .delete('/user')
  //     .set('userid', userid)

  //   // CHECK RESPONSE
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body.ok).toBeTruthy();
  //   expect(response.body.payload).toBeTruthy();

  //   // CHECK DB CONTENT
  //   const userDBResponse = await agent.get(`/tests/user/${mockedUser.id}`);
  //   expect(userDBResponse.statusCode).toEqual(200);
  //   expect(userDBResponse.body.ok).toBeTruthy();
  //   expect(userDBResponse.body.payload.email).toBeNull();
  //   expect(userDBResponse.body.payload.name.includes(' (left)')).toBeTruthy();

  //   const groupsUsersDBResponse = await agent
  //     .get('/tests/fetch-groups-user-is-member-of')
  //     .set('userid', mockedUser.id);
  //   expect(groupsUsersDBResponse.statusCode).toEqual(200);
  //   expect(groupsUsersDBResponse.body.ok).toBeTruthy();
  //   expect(groupsUsersDBResponse.body.payload).toMatchObject([]);

  //   // CLEAN UP - REVERT ACTION
  //   await agent
  //     .put(`/tests/reinsert-user`)
  //     .send({
  //       user: mockedUser,
  //       groups: groupsUserIsMemberOf,
  //     });

  // });



  it('should not delete user if user is not deletable', async () => {
    isUserDeletable.mockImplementation(() => ({ ok: true, payload: false }));
    const userid = 'user5';

    const response = await agent
      .delete('/user')
      .set('userid', userid)

    expect(response.statusCode).toEqual(401);

  });

});