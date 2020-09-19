import pool from '../../models';


export async function mockPlacedOrders () {

  try {
    console.log('MOCKING PLACED ORDERS => START');

    const placedOrder1 = { group_id: 1, user_id: 'user1', available_order_id: 1 };
    const placedOrder2 = { group_id: 1, user_id: 'user1', available_order_id: 2 };
    const placedOrder3 = { group_id: 1, user_id: 'user1', available_order_id: 3 };
    const placedOrder4 = { group_id: 2, user_id: 'user2', available_order_id: 4 };
    const placedOrder5 = { group_id: 2, user_id: 'user4', available_order_id: 4 };
    const placedOrder6 = { group_id: 2, user_id: 'user5', available_order_id: 4 };
    const placedOrder7 = { group_id: 2, user_id: 'user2', available_order_id: 5 };
    const placedOrder8 = { group_id: 2, user_id: 'user4', available_order_id: 5 };
    const placedOrder9 = { group_id: 2, user_id: 'user5', available_order_id: 5 };
    const placedOrder10 = { group_id: 2, user_id: 'user2', available_order_id: 6 };
    const placedOrder11 = { group_id: 2, user_id: 'user4', available_order_id: 6 };
    const placedOrder12 = { group_id: 2, user_id: 'user5', available_order_id: 6 };
    const placedOrder13 = { group_id: 3, user_id: 'user3', available_order_id: 7 };
    const placedOrder14 = { group_id: 3, user_id: 'user4', available_order_id: 7 };
    const placedOrder15 = { group_id: 3, user_id: 'user5', available_order_id: 7 };
    const placedOrder16 = { group_id: 3, user_id: 'user3', available_order_id: 8 };
    const placedOrder17 = { group_id: 3, user_id: 'user4', available_order_id: 8 };
    const placedOrder18 = { group_id: 3, user_id: 'user5', available_order_id: 8 };


    const placedOrders = [];
    placedOrders.push(placedOrder1);
    placedOrders.push(placedOrder2);
    placedOrders.push(placedOrder3);
    placedOrders.push(placedOrder4);
    placedOrders.push(placedOrder5);
    placedOrders.push(placedOrder6);
    placedOrders.push(placedOrder7);
    placedOrders.push(placedOrder8);
    placedOrders.push(placedOrder9);
    placedOrders.push(placedOrder10);
    placedOrders.push(placedOrder11);
    placedOrders.push(placedOrder12);
    placedOrders.push(placedOrder13);
    placedOrders.push(placedOrder14);
    placedOrders.push(placedOrder15);
    placedOrders.push(placedOrder16);
    placedOrders.push(placedOrder17);
    placedOrders.push(placedOrder18);


    const insertPlacedOrderStr = `
      INSERT INTO placed_orders (group_id, user_id, available_order_id)
        VALUES ($1, $2, $3);
    `;

    for (let order of placedOrders) {
      const { group_id, user_id, available_order_id } = order;
      await pool.query(
        insertPlacedOrderStr,
        [group_id, user_id, available_order_id]
      );
    }

    console.log('MOCKING PLACED ORDERS => END');

  } catch (error) {
    console.log('MOCKING PLACED ORDERS => ERROR', error.message);
  }

}
