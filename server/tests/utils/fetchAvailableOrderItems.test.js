'use strict';

const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

import { testsRouter } from '../../router_new';

let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(testsRouter.routes());

  server = app.listen(4000, (err) => {
    if (err) return done(err);
    agent = request.agent(server);
    done();
  });

});

afterEach(async done => {
  return server && server.close(done);
});


describe('fetchAvailableOrderItems', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });



  it('should return list of an available order\'s items', async () => {

    const groupid = '1';

    const availableorderid = '1';

    const response = await agent.get(`/tests/available-order-items/${availableorderid}`);

    const expectedPayload = [
      {
        available_item_id: '1',
        available_item_initial_qty: 12,
        available_item_remaining_qty: 6,
        item_id: '1',
        item_name: 'Group1 Item 1',
        item_description: 'Group1 Item1 Description',
        item_price: '10.00'
      },
      {
        available_item_id: '2',
        available_item_initial_qty: 10,
        available_item_remaining_qty: 0,
        item_id: '2',
        item_name: 'Group1 Item 2',
        item_description: 'Group1 Item2 Description',
        item_price: '15.00'
      },
    ];
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(Array.isArray(response.body.payload)).toBeTruthy();
    expect(response.body.payload).toMatchObject(expectedPayload);

  });


});