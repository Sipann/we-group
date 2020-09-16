'use strict';

import { agent as _agent } from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { groupsRouter } from '../../router_new';
import { isUserGroupMember } from '../../models/utilsModels/isUserGroupMember';
import { fetchGroupAvailableOrders } from '../../models/utilsModels/fetchGroupAvailableOrders';
import { fetchAvailableOrderItems } from '../../models/utilsModels/fetchAvailableOrderItems';


let server, agent;

beforeEach((done) => {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(groupsRouter.routes());

  server = app.listen(4000, (err) => {
    if (err) return done(err);
    agent = _agent(server);
    done();
  });

});

afterEach(async done => {
  return server && server.close(done);
});


jest.mock('../../models/utilsModels/isUserGroupMember', () => ({
  isUserGroupMember: jest.fn(),
}));
jest.mock('../../models/utilsModels/fetchGroupAvailableOrders', () => ({
  fetchGroupAvailableOrders: jest.fn(),
}));
jest.mock('../../models/utilsModels/fetchAvailableOrderItems', () => ({
  fetchAvailableOrderItems: jest.fn(),
}));



describe('fetchGroupFullAvailableOrders', () => {

  // smoke test
  // it('should return true', () => {
  //   expect(true).toBeTruthy();
  // });


  it('should return list of a group\'s available orders with matching items', async () => {

    const mockedAvailableOrdersPayload = [
      { id: '1', deadline_ts: 'deadline1', delivery_ts: 'delivery1', delivery_status: 'ongoing', confirmed_status: true, group_id: '1' },
      { id: '2', deadline_ts: 'deadline2', delivery_ts: 'delivery2', delivery_status: 'pending', confirmed_status: false, group_id: '1' }
    ];

    const mockedAvailableOrderItems = {
      '1': [
        { available_item_id: '1', available_item_initial_qty: 12, available_item_remaining_qty: 6, item_id: '1', item_name: 'Group1 Item1', item_description: 'Group1 Item1 Description', item_price: '10.00' },
        { available_item_id: '2', available_item_initial_qty: 10, available_item_remaining_qty: 5, item_id: '2', item_name: 'Group1 Item2', item_description: 'Group1 Item2 Description', item_price: '8.00' },
      ],
      '2': [
        { available_item_id: '1', available_item_initial_qty: 12, available_item_remaining_qty: 4, item_id: '1', item_name: 'Group1 Item1', item_description: 'Group1 Item1 Description', item_price: '10.00' },
        { available_item_id: '2', available_item_initial_qty: 9, available_item_remaining_qty: 4, item_id: '2', item_name: 'Group1 Item2', item_description: 'Group1 Item2 Description', item_price: '8.00' },
      ]
    };


    fetchAvailableOrderItems.mockImplementation((orderid) => ({ ok: true, payload: mockedAvailableOrderItems[orderid] }));
    fetchGroupAvailableOrders.mockImplementation(() => ({ ok: true, payload: mockedAvailableOrdersPayload }));
    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: true }));
    const groupid = '1';
    const userid = 'user1';

    const expected = {
      '1': {
        deadlineTs: 'deadline1',
        deliveryTs: 'delivery1',
        deliveryStatus: 'ongoing',
        confirmedStatus: true,
        items: mockedAvailableOrderItems['1'],
      },
      '2': {
        deadlineTs: 'deadline2',
        deliveryTs: 'delivery2',
        deliveryStatus: 'pending',
        confirmedStatus: false,
        items: mockedAvailableOrderItems['2'],
      }
    };

    const response = await agent
      .get(`/groups/available-orders/${groupid}`)
      .set('userid', userid);


    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.payload).toMatchObject(expected);

  });

  it('should not return list of group\'s available orders / matching items if userid is missing', async () => {

    const groupid = '1'

    const response = await agent.get(`/groups/available-orders/${groupid}`);

    expect(response.statusCode).toEqual(401);
  });


  it('should not return list of group\'s available orders / matching items if current user is not Group Member', async () => {

    isUserGroupMember.mockImplementation(() => ({ ok: true, payload: false }));
    const groupid = '1'
    const userid = 'user2'; // user2 is not a member of Group1

    const response = await agent
      .get(`/groups/available-orders/${groupid}`)
      .set('userid', userid);

    expect(response.statusCode).toEqual(401);
  });


});