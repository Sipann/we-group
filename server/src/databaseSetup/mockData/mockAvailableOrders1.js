import Mockdate from 'mockdate';
import { add } from 'date-fns';
import pool from '../../models';

const env = process.env.NODE_ENV || 'development';

export async function mockAvailableOrders () {

  try {
    console.log('MOCKING AVAILABLE ORDERS => START');

    const availableOrderStr = `
        INSERT INTO available_orders (deadline_ts, delivery_ts, delivery_status, confirmed_status, group_id)
          VALUES ($1, $2, $3, $4, $5);
      `;

    // Group1 Available Order #1 - passed deadlineTs && deliveryTs    #id 1
    await pool.query(
      availableOrderStr,
      [new Date('2020-09-18'), new Date('2020-09-20'), 'done', true, 1]
    );

    // Group1 Available Order #2 - passed deadlineTs && coming deliveryTs    #id 2
    await pool.query(
      availableOrderStr,
      [new Date('2020-09-20'), new Date('2020-11-10'), 'ongoing', true, 1]
    );

    // Group1 Available Order #3 - coming deadlineTs && deliveryTs    #id 3
    await pool.query(
      availableOrderStr,
      [new Date('2020-11-21'), new Date('2020-11-22'), 'pending', false, 1]
    );

    // Group2 Available Order #1 - passed deadlineTs && deliveryTs    #id 4
    await pool.query(
      availableOrderStr,
      [new Date('2020-08-31'), new Date('2020-09-05'), 'done', true, 2]
    );

    // Group2 Available Order #2 - passed deadlineTs && coming deliveryTs    #id 5
    await pool.query(
      availableOrderStr,
      [new Date('2020-10-28'), new Date('2020-11-03'), 'ongoing', true, 2]
    );

    // Group2 Available Order #3 - coming deadlineTs && deliveryTs    #id 6
    await pool.query(
      availableOrderStr,
      [new Date('2020-12-01'), new Date('2020-12-15'), 'pending', false, 2]
    );

    // Group3 Available Order #1 - passed deadlineTs && deliveryTs    #id 7
    await pool.query(
      availableOrderStr,
      [new Date('2020-10-05'), new Date('2020-10-15'), 'done', true, 3]
    );

    // Group3 Available Order #2 - passed deadlineTs && coming deliveryTs    #id 8
    await pool.query(
      availableOrderStr,
      [new Date('2020-09-30'), new Date('2020-10-22'), 'done', true, 3]
    );

    // Group3 Available Order #3 - passed deadlineTs && deliveryTs    #id 9
    await pool.query(
      availableOrderStr,
      [new Date('2020-10-17'), new Date('2020-10-21'), 'done', false, 3]
    );

    console.log('MOCKING AVAILABLE ORDERS => END');

  } catch (error) {
    console.log('MOCKING AVAILABLE ORDERS => ERROR', error.message);
  }

}
