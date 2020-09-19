'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import isEqual from 'lodash.isequal';

import { testsRouter } from '../../src/router_new';


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


describe('fetchGroupsUserIsMemberOf', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return list of groups a user is a member of', async () => {

    const userid = 'user4';

    const response = await agent
      .get('/tests/fetch-groups-user-is-member-of')
      .set('userid', userid);

    const expected = {
      ok: true,
      payload: [
        {
          id: '2',
          name: 'Barajas',
          description: 'Fruits & Vegetables',
          manager_id: 'user2'
        },
        {
          id: '3',
          name: 'Bella Vita',
          description: 'Italian Delicatessen',
          manager_id: 'user3'
        }
      ],
    };

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.payload)).toBeTruthy();
    //TODO expect(isEqual(response.body.payload, expected)).toBeTruthy();

  });


  it('should return an empty array if user is not a member of any groups', async () => {

    const userid = 'user6';

    const response = await agent
      .get('/tests/fetch-groups-user-is-member-of')
      .set('userid', userid);

    const expected = {
      ok: true,
      payload: [],
    };

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject(expected);

  });

});