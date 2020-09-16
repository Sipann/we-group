'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { testsRouter } from '../../router_new';
import { getAvailableOrderById } from '../../models/testsModels/getAvailableOrderById';  //! moved utilsModels

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


jest.mock('../../models/testsModels/getAvailableOrderById', () => ({   //! moved
  getAvailableOrderById: jest.fn(),
}));



describe('isAvailableOrderEditable', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return true if corresponding available order has not been confirmed && deadline is in the future', async () => {
    const mockedAvailableOrder = {
      confirmed: false,
      delivery_status: 'pending'
    };
    getAvailableOrderById.mockImplementation(() => ({ ok: true, payload: mockedAvailableOrder }));
    const availableOrderId = '6';

    const response = await agent.get(`/tests/is-available-order-editable/${availableOrderId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeTruthy();

  });


  it('should return false if corresponding available order has been confirmed || deadline is in the past', async () => {
    const mockedAvailableOrder = {
      confirmed: true,
      delivery_status: 'done'
    };
    getAvailableOrderById.mockImplementation(() => ({ ok: true, payload: mockedAvailableOrder }));
    const availableOrderId = '1';

    const response = await agent.get(`/tests/is-available-order-editable/${availableOrderId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toBeFalsy();

  });


});