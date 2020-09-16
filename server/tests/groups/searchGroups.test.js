'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import isEqual from 'lodash.isequal';

import { testsRouter, groupsRouter } from '../../router_new';
import { isUserIdValid } from '../../models/utilsModels/isUserIdValid';

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


jest.mock('../../models/utilsModels/isUserIdValid', () => ({
  isUserIdValid: jest.fn(),
}));


describe('searchGroups', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });

  it('should return list of group current user is NOT a member of', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: true }));
    const userid = 'user4';

    const response = await agent
      .get('/groups/search')
      .set('userid', userid);

    const expected = [
      {
        group_id: '2',
        group_name: 'Barajas',
        group_currency: 'eur',
        group_description: 'Fruits & Vegetables',
        group_manager_id: 'user2'
      },
      {
        group_id: '3',
        group_name: 'Bella Vita',
        group_currency: 'eur',
        group_description: 'Italian Delicatessen',
        group_manager_id: 'user3'
      }
    ];

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.payload)).toBeTruthy();
    //TODO expect(isEqual(response.body.payload, expected)).toBeTruthy();

  });

  it('should NOT return any list if userid is not valid', async () => {
    isUserIdValid.mockImplementation(() => ({ ok: true, payload: false }));

    const response = await agent
      .get('/groups/search')
      .set('userid', 'wronguserid');

    expect(response.statusCode).toEqual(401);
  });

});
