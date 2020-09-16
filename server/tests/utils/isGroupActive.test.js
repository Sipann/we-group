'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter } from '../../router_new';

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


describe('isGroupActive', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true if group is active / has a manager', async () => {
    const groupid = 2;

    const response = await agent.get(`/tests/is-group-active/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();
  });


  it('should return true is group is inactive / has no manager', async () => {

    // const groupid = '4'; //! TO UPDATE WHEN MOCK DATA CORRECTLY UPDATED => Assign "Bon Appetit" to Group4
    //!TO DELETE WHEN MOCK DATA CORRECTLY UPDATED - START
    const groupname = 'Bon Appetit';
    const group = await agent.get(`/tests/get-group-by-name/${groupname}`);
    const groupid = group.body.payload.id;
    // console.log('groupid =>', groupid);
    //!TO DELETE WHEN MOCK DATA CORRECTLY UPDATED - END

    const response = await agent.get(`/tests/is-group-active/${groupid}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();
  });

});