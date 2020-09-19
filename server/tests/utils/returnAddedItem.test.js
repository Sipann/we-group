'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

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


describe('returnAddedItem', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return full info about an available item', async () => {

    const itemid = '2';
    const availableorderid = '1';

    const expected = {
      availableitemid: '2',
      availableiteminitialqty: 10,
      availableitemremainingqty: 0,
      itemid: '2',
      itemname: 'Group1 Item 2',
      itemdescription: 'Group1 Item2 Description',
      itemprice: '15.00',
    };

    const response = await agent.get(`/tests/return-added-item/${itemid}/${availableorderid}`);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(expected);

  });

});
